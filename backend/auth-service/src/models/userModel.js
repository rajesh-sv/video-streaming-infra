import * as db from "../db/postgresPool.js";

export class User {
  static async createUser(username, email, password) {
    const query = {
      text: "INSERT INTO users(username, email, password) VALUES($1, $2, $3) RETURNING *;",
      values: [username, email, password],
    };

    const result = await db.query(query);
    return result;
  }

  static async getUserByUsername(username) {
    const query = {
      text: "SELECT * FROM users WHERE username = $1;",
      values: [username],
    };

    const result = await db.query(query);
    return result;
  }

  static async getUserByUserId(userId) {
    const query = {
      text: "SELECT * FROM users WHERE user_id = $1;",
      values: [userId],
    };

    const result = await db.query(query);
    return result;
  }
}
