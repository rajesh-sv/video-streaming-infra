import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { authRouter } from "./routes/authRoutes.js";
import { logger } from "./utils/pinoLogger.js";
import { PORT } from "./config/config.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(authRouter);

app.listen(PORT, () => {
  logger.info(`Server running on port: ${PORT}`);
});
