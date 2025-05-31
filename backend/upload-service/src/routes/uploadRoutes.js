import { Router } from "express";
import { getS3PresignedUrl, postVideo } from "../controllers/uploadController";

const uploadRouter = Router();

uploadRouter.get("/s3url", getS3PresignedUrl);

uploadRouter.post("/video", postVideo);

export { uploadRouter };
