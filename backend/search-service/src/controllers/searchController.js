import { Video } from "../models/videoModel.js";
import { logger } from "../utils/pinoLogger.js";

export async function search(req, res) {
  try {
    const { searchString } = req.body;

    if (searchString.length === 0) {
      return res.status(400).json({
        status: 400,
        error: {
          message: "Search string empty",
        },
      });
    }

    const videoIds = await Video.getVideoIdsBySearchString(searchString);
    const videos = [];
    for (const videoId of videoIds) {
      const video = await Video.getVideoByVideoId(videoId);
      videos.push(video);
    }

    return res.status(200).json({
      status: 200,
      data: {
        message: "Found videos",
        videos,
      },
    });
  } catch (error) {
    logger.error(`Error in search controller: ${error.message}`);

    return res.status(500).json({
      status: 500,
      error: {
        message: "Internal Server Error",
      },
    });
  }
}
