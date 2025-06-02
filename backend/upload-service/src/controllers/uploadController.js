import {
  KAFKA_VIDEO_RESOLUTION_TOPIC,
  KAFKA_VIDEO_SEARCH_INDEX_TOPIC,
  REGION,
  S3_BUCKET,
} from "../config/config.js";
import { Video } from "../models/videoModel.js";
import { generateS3PresignedUploadUrl } from "../utils/generateS3PresignedUploadUrl.js";
import * as kafka from "../db/kafkaProducer.js";
import { logger } from "../utils/pinoLogger.js";
import { v4 as uuid4 } from "uuid";
import { z } from "zod/v4";

const VideoFileSchema = z.object({
  filename: z.string().trim().min(5).max(100),
  title: z.string().trim().min(5).max(100),
  description: z.string().trim().max(10000),
  awsKey: z.string(),
});

export async function getS3PresignedUploadUrl(req, res) {
  try {
    const result = VideoFileSchema.omit({ awsKey: true }).safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        error: z.treeifyError(result.error).properties,
      });
    }

    const { filename } = result.data;
    const awsKey = `${uuid4()}-${filename}`;
    const uploadUrl = await generateS3PresignedUploadUrl(awsKey);
    return res.status(200).json({
      status: 200,
      data: {
        message: "Presigned S3 upload url created",
        uploadUrl,
        awsKey,
      },
    });
  } catch (error) {
    logger.error(`Error in presigned url controller: ${error.message}`);

    return res.status(500).json({
      status: 500,
      error: {
        message: "Internal Server Error",
      },
    });
  }
}

export async function postVideo(req, res) {
  try {
    let result = VideoFileSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        error: z.treeifyError(result.error).properties,
      });
    }
    const { filename, title, description, awsKey } = result.data;
    const userId = req.locals.user.userId;
    const awsUrl = `https://${S3_BUCKET}.s3.${REGION}.amazonaws.com/${awsKey}`;
    result = await Video.insertVideo(
      filename,
      title,
      description,
      awsUrl,
      userId,
      false,
    );
    const insertFailed = result.rows.length === 0;
    if (insertFailed) {
      throw new Error("Failed to insert video to database");
    }
    const { video_id } = result.rows[0];

    const message = JSON.stringify({
      filename,
      title,
      description,
      awsKey,
      userId,
      videoId: video_id,
    });
    await Promise.all([
      kafka.sendMessages(KAFKA_VIDEO_RESOLUTION_TOPIC, message),
      kafka.sendMessages(KAFKA_VIDEO_SEARCH_INDEX_TOPIC, message),
    ]);

    res.status(200).json({
      status: 200,
      message: "Video uploaded successfully",
    });
  } catch (error) {
    logger.error(`Error in presigned url controller: ${error.message}`);

    return res.status(500).json({
      status: 500,
      error: {
        message: "Internal Server Error",
      },
    });
  }
}
