import ffmpeg
import os
from logger import logger
from uuid import uuid4


def process_video(input_path, output_dir, resolutions):
    base_name = os.path.splitext(os.path.basename(input_path))[0]
    processed_video_paths = []

    for resolution in resolutions:
        try:
            output_filename = f"{uuid4()}-{base_name}-{resolution}.mp4"
            output_path = os.path.join(output_dir, output_filename)

            logger.info(f"Processing {base_name} to {resolution} resolution...")
            (
                ffmpeg.input(input_path)
                .output(output_path, vf=f"scale={resolution}", preset="fast", crf=23)
                .run(overwrite_output=True, capture_stdout=True, capture_stderr=True)
            )
            logger.info(f"Successfully processed video to {resolution}: {output_path}")
            processed_video_paths.append(output_path)
        except ffmpeg.Error as e:
            logger.error(f"FFMPEG error processing {base_name} to {resolution}: {e}")
        except Exception as e:
            logger.error(f"Error processing video {base_name} to {resolution}: {e}")
    return processed_video_paths
