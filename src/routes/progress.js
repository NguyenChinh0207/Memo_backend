import express from "express";
const progressRouter = express.Router();

import verifyToken from "../middleware/auth";
import { createProgress, getProgressByUserId, updateProgress,  } from "../controllers/progressController";

progressRouter.post("/create", createProgress);
progressRouter.post("/update", verifyToken, updateProgress);
progressRouter.post("/detail", verifyToken, getProgressByUserId);

export default progressRouter;
