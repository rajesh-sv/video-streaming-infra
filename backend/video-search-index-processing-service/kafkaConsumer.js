import { Kafka } from "kafkajs";
import {
  ensureIndexExists,
  indexVideoDocument,
} from "./elasticsearchService.js";
import { KAFKA_BROKER, KAFKA_TOPIC } from "./config.js";
import { logger } from "./pinoLogger.js";

const KAFKA_GROUP_ID = "video-search-index-processing-service";
const KAFKA_CLIENT_ID = "video-search-index-processing-client";

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_BROKER, "localhost:9092"],
});

const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

async function consumeMessages() {
  await ensureTopicExists();
  await ensureIndexExists();
  await consumer.connect();
  await consumer.subscribe({ topics: [KAFKA_TOPIC] });
  logger.info(`Subscribed to topic: ${KAFKA_TOPIC}`);

  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const rawMessage = message.value.toString();
        const videoData = JSON.parse(rawMessage);
        await indexVideoDocument(videoData);
      } catch (error) {
        logger.error("Error processing message or indexing:", error);
      }
    },
  });
}

consumeMessages().catch((error) => {
  logger.error(`An unexpected error occured: ${error}`);
  gracefulShutdown("unhandledError");
});

async function ensureTopicExists() {
  const admin = kafka.admin();
  await admin.connect();
  const topics = await admin.listTopics();

  if (!topics.includes(KAFKA_TOPIC)) {
    logger.info(`Kafka topic "${KAFKA_TOPIC}" does not exist. Creating...`);
    await admin.createTopics({
      topics: [
        {
          topic: KAFKA_TOPIC,
        },
      ],
    });
    logger.info(`Kafka topic "${KAFKA_TOPIC}" created`);
  }
}

async function gracefulShutdown(signal) {
  logger.error(`Received ${signal}. Shutting down gracefully...`);
  try {
    await consumer.disconnect();
    logger.info("Consumer closed");
    process.exit(0);
  } catch (_) {
    logger.error(`Error during exit, forcing exit...`);
    process.exit(1);
  }
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
