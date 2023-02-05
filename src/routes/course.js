import express from "express";
const courseRouter = express.Router();

import verifyToken from "../middleware/auth.js";
import {
  addMyCourse,
  create,
  deleteCourse,
  detail,
  edit,
  getMyCourses,
  list,
  listAll,
  listCourseOwner,
  removeMyCourse,
} from "../controllers/courseController.js";
import multer from "multer";
import { uuid } from "uuidv4";
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./uploads");
//   },
//     filename: (req, file, cb) => {
//       console.log("in file", file);
//     const fileName = file.originalname.toLowerCase().split(" ").join("-");
//     cb(null, uuid() + "-" + fileName);
//   },
// });
// let upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     if (
//       file.mimetype == "image/png" ||
//       file.mimetype == "image/jpg" ||
//       file.mimetype == "image/jpeg"
//     ) {
//       cb(null, true);
//     } else {
//       cb(null, false);
//       return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
//     }
//   },
// });

courseRouter.post("/create", verifyToken, create);
courseRouter.post("/edit", verifyToken, edit);
courseRouter.post("/", verifyToken, list);
courseRouter.post("/detail", verifyToken, detail);
courseRouter.post("/delete", verifyToken, deleteCourse);
courseRouter.post("/wishlist/add", verifyToken, addMyCourse);
courseRouter.post("/wishlist/remove", verifyToken, removeMyCourse);
courseRouter.post("/mycourses", verifyToken, getMyCourses);
courseRouter.post("/list/owner", verifyToken, listCourseOwner);
courseRouter.post("/list/all", verifyToken, listAll);

export default courseRouter;
