import { generateS3PresignedUploadUrl } from "../utils/generateS3PresignedUploadUrl.js";
import { z } from "zod/v4";

const VideoFileSchema = z.object({
  filename: z.string().trim().min(5).max(100),
  title: z.string().trim().min(5).max(100),
  description: z.string().trim().max(10000),
});

export async function getS3PresignedUploadUrl(req, res) {
  try {
    let result = VideoFileSchema.pick({
      filename: true,
    }).safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        error: z.treeifyError(result.error).properties,
      });
    }

    const { filename } = result.data;
    const uploadUrl = await generateS3PresignedUploadUrl(filename);
    return res.status(200).json({
      status: 200,
      data: {
        message: "Presigned S3 upload url created",
        uploadUrl,
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

export async function postVideo() {}
