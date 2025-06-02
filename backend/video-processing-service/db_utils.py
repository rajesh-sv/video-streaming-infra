import psycopg2
from psycopg2 import Error
from logger import logger
from config import PG_URI


def get_db_connection():
    conn = None
    try:
        conn = psycopg2.connect(PG_URI)
        return conn
    except Error as e:
        logger.error(f"Error connecting to PostgreSQL database: {e}")
        return None


def insert_video_version(conn, video_id, resolution, aws_url):
    try:
        with conn.cursor() as cur:
            insert_query = """
            INSERT INTO video_versions(video_id, resolution, aws_url)
            VALUES(%s, %s, %s);
            """
            cur.execute(insert_query, (video_id, resolution, aws_url))
            conn.commit()
            return True
    except Exception as e:
        conn.rollback()
        logger.error(f"Error in insert_video_version: {e}")
        return False


def update_video_processed_status(conn, video_id):
    try:
        with conn.cursor() as cur:
            update_query = """
            UPDATE videos SET processed = TRUE WHERE video_id = %s;
            """
            cur.execute(update_query, (video_id,))
            conn.commit()
            return True
    except Exception as e:
        conn.rollback()
        logger.error(f"Error in update_video_processed_status: {e}")
        return False
