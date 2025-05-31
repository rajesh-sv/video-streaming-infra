import { Router } from "express";
import {
  getS3PresignedUploadUrl,
  postVideo,
} from "../controllers/uploadController";

const uploadRouter = Router();

uploadRouter.get("/s3UploadUrl", getS3PresignedUploadUrl);

uploadRouter.post("/video", postVideo);

export { uploadRouter };
