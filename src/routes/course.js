import express from "express";
const courseRouter = express.Router();

import verifyToken from "../middleware/auth.js";
import { addMyCourse, create, deleteCourse, detail, edit, getMyCourses, list, listAll, listCourseOwner, removeMyCourse } from "../controllers/courseController.js";

courseRouter.post("/create", verifyToken, create);
courseRouter.post("/edit", verifyToken, edit);
courseRouter.post("/", verifyToken, list);
courseRouter.post("/detail", verifyToken, detail);
courseRouter.post("/delete", verifyToken, deleteCourse);
courseRouter.post("/wishlist/add", verifyToken, addMyCourse);
courseRouter.post("/wishlist/remove", verifyToken, removeMyCourse);
courseRouter.post("/mycourses", verifyToken, getMyCourses);
courseRouter.post("/list/owner", verifyToken, listCourseOwner);
courseRouter.post("/list/all", verifyToken, listAll)

export default courseRouter;