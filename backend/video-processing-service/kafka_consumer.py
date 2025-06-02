from confluent_kafka import Consumer, KafkaException, KafkaError
from confluent_kafka.admin import AdminClient, NewTopic
import json
import os
import tempfile
from logger import logger
from config import KAFKA_BROKER, KAFKA_TOPIC, REGION, S3_BUCKET

import s3_utils
import video_processor
from db_utils import (
    get_db_connection,
    insert_video_version,
    update_video_processed_status,
)

consumer_config = {
    "bootstrap.servers": KAFKA_BROKER,
    "group.id": "video-resolution-processing-service",
    "client.id": "video-resolution-processing-client",
    "enable.auto.commit": "true",
    "enable.auto.offset.store": "true",
    "auto.offset.reset": "earliest",
}


def consume_messages():
    consumer = None
    db_conn = None

    try:
        ensure_topic_exists(KAFKA_TOPIC, consumer_config["bootstrap.servers"])

        db_conn = get_db_connection()
        if not db_conn:
            logger.fatal("Failed to connect to database. Exiting...")
            return

        consumer = Consumer(consumer_config)
        consumer.subscribe([KAFKA_TOPIC])
        logger.info(f"Subscribed to topic: {KAFKA_TOPIC}")

        while True:
            msg = consumer.poll(1.0)

            if msg is None:
                continue
            if msg.error():
                if msg.error().code() != KafkaError._PARTITION_EOF:
                    raise KafkaException(msg.error())
            else:
                try:
                    message_data = json.loads(msg.value().decode("utf-8"))
                    filename, title, description, awsKey, userId, videoId = (
                        message_data.values()
                    )
                    aws_key, uses_id, video_id = awsKey, userId, videoId

                    with tempfile.TemporaryDirectory() as temp_dir:
                        input_video_path = os.path.join(temp_dir, filename)

                        if not s3_utils.download_video_from_s3(
                            aws_key, input_video_path
                        ):
                            logger.error(f"Failed to download video from {aws_key}")
                            continue

                        processed_files = video_processor.process_video(
                            input_video_path, temp_dir, target_resolutions
                        )
                        for i, p_file in enumerate(processed_files):
                            aws_upload_key = f"{os.path.basename(p_file)}"
                            aws_upload_url = f"https://{S3_BUCKET}.s3.{REGION}.amazonaws.com/{aws_upload_key}"
                            if s3_utils.upload_video_to_s3(p_file, aws_upload_key):
                                insert_video_version(
                                    db_conn,
                                    video_id,
                                    target_resolutions[i],
                                    aws_upload_url,
                                )
                        update_video_processed_status(db_conn, video_id)

                    logger.info(f"Successfully processed {aws_key} video")
                except Exception as e:
                    logger.error(f"Error processing message: {e}")

    except KafkaException as e:
        logger.error(f"Kafka Error: {e}")
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
    finally:
        if consumer:
            consumer.close()
            logger.info("Consumer closed")


def ensure_topic_exists(topic_name, bootstrap_servers):
    admin_client_config = {"bootstrap.servers": bootstrap_servers}
    admin_client = AdminClient(admin_client_config)

    metadata = admin_client.list_topics(timeout=10)
    if topic_name in metadata.topics:
        return

    new_topic = NewTopic(topic_name)

    fs = admin_client.create_topics([new_topic])
    for topic, f in fs.items():
        f.result()


target_resolutions = ["1920x1080", "1280x720", "854x480"]

if __name__ == "__main__":
    consume_messages()
