import { Router } from "express";

import {
  signup,
  login,
  logout,
  verify,
} from "../controllers/authController.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verify", verify);

export { authRouter };
