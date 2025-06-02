import { Router } from "express";
import {
  getS3PresignedUploadUrl,
  postVideo,
} from "../controllers/uploadController.js";
import { authenticateUser } from "../middlewares/authenticateUser.js";

const uploadRouter = Router();

uploadRouter.post("/s3UploadUrl", authenticateUser, getS3PresignedUploadUrl);

uploadRouter.post("/video", authenticateUser, postVideo);

export { uploadRouter };
