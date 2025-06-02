import { User } from "../models/userModel.js";
import { logger } from "../utils/pinoLogger.js";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "../config/config.js";

export async function authenticateUser(req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({
        status: 401,
        error: {
          message: "Unauthorized - no token provided",
        },
      });
    }

    const decoded = jwt.verify(token, JWT_PUBLIC_KEY);
    if (!decoded) {
      res.clearCookie("jwt");
      return res.status(401).json({
        status: 401,
        error: {
          message: "Unauthorized - invalid token",
        },
      });
    }

    const result = await User.getUserByUserId(decoded.userId);
    const userExists = result.rows.length !== 0;
    if (!userExists) {
      res.clearCookie("jwt");
      return res.status(401).json({
        status: 401,
        error: {
          message: "Unauthorized - invalid token",
        },
      });
    }

    const user = result.rows[0];
    if (user.updated_at.valueOf() <= decoded.exp) {
      res.clearCookie("jwt");
      return res.status(401).json({
        status: 401,
        error: {
          message: "Unauthorized - invalid token",
        },
      });
    }

    req.locals = {
      user: {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    };
    next();
  } catch (error) {
    logger.error(`Error in verify controller: ${error.message}`);

    return res.status(500).json({
      status: 500,
      error: {
        message: "Internal Server Error",
      },
    });
  }
}
