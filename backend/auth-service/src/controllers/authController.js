import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import { generateJwtAndSetCookie } from "../utils/generateJwtAndSetCookie.js";
import { logger } from "../utils/pinoLogger.js";
import { z } from "zod/v4";
import { JWT_PUBLIC_KEY } from "../config/config.js";

const UserSchema = z.object({
  username: z.string().trim().min(5).max(32),
  email: z.email(),
  password: z.string().trim().min(6).max(72),
});

export async function signup(req, res) {
  try {
    let result = UserSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        error: z.treeifyError(result.error).properties,
      });
    }
    const { username, email, password } = result.data;

    result = await User.getUserByUsername(username);
    const usernameExists = result.rows.length !== 0;
    if (usernameExists) {
      return res.status(400).json({
        status: 400,
        error: {
          message: "Username already exists",
        },
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    result = await User.createUser(username, email, hashPassword);
    const user = result.rows[0];

    return res.status(201).json({
      status: 201,
      data: {
        message: "User created",
        userId: user.user_id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    logger.error(`Error in signup controller: ${error.message}`);

    return res.status(500).json({
      status: 500,
      error: {
        message: "Internal Server Error",
      },
    });
  }
}

export async function login(req, res) {
  try {
    let result = UserSchema.omit({ email: true }).safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        status: 400,
        error: z.treeifyError(result.error).properties,
      });
    }
    const { username, password } = result.data;

    result = await User.getUserByUsername(username);
    const userExists = result.rows.length !== 0;
    if (!userExists) {
      return res.status(401).json({
        status: 401,
        error: {
          message: "Invalid username or password",
        },
      });
    }

    const user = result.rows[0];
    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({
        status: 401,
        error: {
          message: "Invalid username or password",
        },
      });
    }

    generateJwtAndSetCookie({ userId: user.user_id }, res);

    return res.status(200).json({
      status: 200,
      data: {
        message: "Logged in successfully",
        userId: user.user_id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    logger.error(`Error in login controller: ${error.message}`);

    return res.status(500).json({
      status: 500,
      error: {
        message: "Internal Server Error",
      },
    });
  }
}

export async function logout(req, res) {
  res.clearCookie("jwt");
  res.status(200).json({
    status: 200,
    data: {
      message: "Logged out successfully",
    },
  });
}

export async function verify(req, res) {
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

    return res.status(200).json({
      status: 200,
      data: {
        message: "User authenticated",
        userId: user.user_id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at,
      },
    });
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
