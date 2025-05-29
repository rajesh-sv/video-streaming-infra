import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "../config/config.js";

const THIRTY_DAYS_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;

export function generateJwtAndSetCookie(payload, res) {
  const jwtToken = jwt.sign(payload, JWT_PRIVATE_KEY, {
    expiresIn: THIRTY_DAYS_IN_MILLISECONDS,
  });
  res.cookie("jwt", jwtToken, {
    maxAge: THIRTY_DAYS_IN_MILLISECONDS,
    httpOnly: true,
    sameSite: true,
    secure: true,
  });
}
