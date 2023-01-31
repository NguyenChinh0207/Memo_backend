import express from "express";
const progressRouter = express.Router();

import verifyToken from "../middleware/auth.js";
import { createProgress, getProgressByUserId, updateProgress,  } from "../controllers/progressController.js";

progressRouter.post("/create", createProgress);
progressRouter.post("/update", verifyToken, updateProgress);
progressRouter.post("/detail", verifyToken, getProgressByUserId);

export default progressRouter;
