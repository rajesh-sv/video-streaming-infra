import * as db from "../db/postgresPool.js";

export class Video {
  static async insertVideo(
    filename,
    title,
    description,
    awsUrl,
    userId,
    processed,
  ) {
    const query = {
      text: `INSERT INTO videos(file_name, title, description, aws_url, user_id, processed) 
             VALUES($1, $2, $3, $4, $5, $6) RETURNING video_id;`,
      values: [filename, title, description, awsUrl, userId, processed],
    };

    const result = await db.query(query);
    return result;
  }
}
