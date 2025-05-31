import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { uploadRouter } from "./routes/uploadRoutes";
import { PORT } from "./config/config.js";
import { logger } from "./utils/pinoLogger.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(uploadRouter);

app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
});
