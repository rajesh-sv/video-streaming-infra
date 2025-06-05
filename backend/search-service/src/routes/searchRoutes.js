import { Router } from "express";
import { authenticateUser } from "../middlewares/authenticateUser.js";
import { search } from "../controllers/searchController.js";

const searchRouter = Router();

searchRouter.get("/search", authenticateUser, search);

export { searchRouter };
