import express from "express";
import { createLesson, deleteLesson, detailLesson, editLesson, getLessonsByUnitId } from "../controllers/lessonController.js";
const lessonRouter = express.Router();

import verifyToken from "../middleware/auth.js";

lessonRouter.post("/create", verifyToken, createLesson);
lessonRouter.post("/", verifyToken, getLessonsByUnitId);
lessonRouter.post("/edit", verifyToken, editLesson);
lessonRouter.post("/delete", verifyToken, deleteLesson);
lessonRouter.post("/detail", verifyToken, detailLesson);

export default lessonRouter;
