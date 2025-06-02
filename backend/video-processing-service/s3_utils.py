import boto3
from botocore.config import Config
from logger import logger
from config import REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET

s3_client = boto3.client(
    "s3",
    config=Config(region_name=REGION),
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
)


def download_video_from_s3(aws_key, download_path):
    try:
        logger.info(
            f"Attempting to download s3://{S3_BUCKET}/{aws_key} to {download_path}"
        )
        s3_client.download_file(S3_BUCKET, aws_key, download_path)
        logger.info(f"Successfully downloaded {aws_key} to {download_path}")
        return True
    except Exception as e:
        logger.error(f"Error downloading video from S3 ({aws_key}): {e}")
        return False


def upload_video_to_s3(file_path, aws_key):
    try:
        logger.info(f"Uploading {file_path} to s3://{S3_BUCKET}/{aws_key}")
        s3_client.upload_file(file_path, S3_BUCKET, aws_key)
        logger.info(f"Successfully uploaded {file_path} to S3")
        return True
    except Exception as e:
        logger.error(f"Error uploading {file_path} to S3: {e}")
        return False
