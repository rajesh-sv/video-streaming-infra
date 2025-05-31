import * as db from "../db/postgresPool.js";

export class User {
  static async getUserByUserId(userId) {
    const query = {
      text: "SELECT * FROM users WHERE user_id = $1;",
      values: [userId],
    };

    const result = await db.query(query);
    return result;
  }
}
