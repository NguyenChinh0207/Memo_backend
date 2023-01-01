import express from "express";
const courseRouter = express.Router();

import verifyToken from "../middleware/auth";
import { create, deleteCourse, detail, edit, list } from "../controllers/courseController";

courseRouter.post("/create", verifyToken, create);
courseRouter.post("/edit", verifyToken, edit);
courseRouter.post("/", verifyToken, list);
courseRouter.post("/detail", verifyToken, detail);
courseRouter.post("/delete", verifyToken, deleteCourse);

export default courseRouter;