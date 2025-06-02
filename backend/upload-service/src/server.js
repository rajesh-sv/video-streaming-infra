import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { uploadRouter } from "./routes/uploadRoutes.js";
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

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.forEach((type) => {
  process.on(type, (e) => {
    try {
      logger.fatal(type);
      logger.error(e);
      process.exit(0);
    } catch (_) {
      logger.error("Error during exit, forcing exit...");
      process.exit(1);
    }
  })
});

signalTraps.forEach((type) => {
  process.once(type, () => {
    logger.fatal(type)
    logger.info("Killing the process");
    process.kill(process.pid, type);
  })
});
