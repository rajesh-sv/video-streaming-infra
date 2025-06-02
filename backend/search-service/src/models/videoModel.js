import * as db from "../db/postgresPool.js";
import * as si from "../db/elasticsearchClient.js";

export class Video {
  static async getVideoByVideoId(videoId) {
    const query = {
      text: `SELECT title, description, aws_url FROM videos WHERE video_id = $1;`,
      values: [videoId],
    };

    const result = await db.query(query);
    return result;
  }

  static async getVideoIdsBySearchString(searchString) {
    const videoIds = await si.search(searchString);
    return videoIds;
  }
}
