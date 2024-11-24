import express from "express";
const courseRouter = express.Router();

import verifyToken from "../middleware/auth.js";
import {
  addMyCourse,
  create,
  deleteCourseByUserId,
  detail,
  edit,
  getMyCourses,
  list,
  listAll,
  listCourseOwner,
  removeMyCourse,
  uploadFile,
} from "../controllers/courseController.js";
import multer from "multer";
import pkg from "uuid";
const { v4: uuid } = pkg;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Phân loại thư mục lưu trữ dựa trên loại MIME
    if (file.mimetype.startsWith("image/")) {
      cb(null, "..", "uploads", "images"); // Thư mục cho ảnh
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, "..", "uploads", "videos"); // Thư mục cho video
    } else {
      cb(new Error("Invalid file type")); // Trả lỗi nếu không phải ảnh hoặc video
    }
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-"); // Chuẩn hóa tên tệp
    cb(null, uuid() + "-" + fileName); // Đặt tên tệp với UUID để tránh trùng lặp
  },
});

// Bộ lọc tệp cho Multer
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") || // Cho phép ảnh
    file.mimetype.startsWith("video/") // Cho phép video
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only image and video files are allowed!")); // Lỗi nếu loại tệp không hợp lệ
  }
};

// Khởi tạo middleware Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

courseRouter.post("/create", verifyToken, create);
courseRouter.post("/edit", verifyToken, edit);
courseRouter.post("/", verifyToken, list);
courseRouter.post("/detail", verifyToken, detail);
courseRouter.post("/delete", verifyToken, deleteCourseByUserId);
courseRouter.post("/wishlist/add", verifyToken, addMyCourse);
courseRouter.post("/wishlist/remove", verifyToken, removeMyCourse);
courseRouter.post("/mycourses", verifyToken, getMyCourses);
courseRouter.post("/list/owner", verifyToken, listCourseOwner);
courseRouter.post("/list/all", verifyToken, listAll);
courseRouter.post("/upload", upload.single("file"), verifyToken, uploadFile);

export default courseRouter;
