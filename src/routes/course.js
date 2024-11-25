import express from "express";
import multer from "multer";
import pkg from "uuid";
import path from "path";
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


const courseRouter = express.Router();
const { v4: uuid } = pkg;
const __dirname = path.resolve(); // Xác định thư mục gốc

// Cấu hình Multer để lưu trữ file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Phân loại tệp và xác định thư mục lưu trữ
    const uploadPath = file.mimetype.startsWith("image/")
      ? path.join(__dirname, "uploads", "images")
      : file.mimetype.startsWith("video/")
      ? path.join(__dirname, "uploads", "videos")
      : null;

    if (uploadPath) {
      cb(null, uploadPath); // Thư mục hợp lệ
    } else {
      cb(new Error("Invalid file type")); // Loại tệp không hợp lệ
    }
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-"); // Chuẩn hóa tên tệp
    cb(null, `${uuid()}-${fileName}`); // Tên tệp với UUID
  },
});

// Bộ lọc tệp để kiểm tra MIME type
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true); // Cho phép tệp hợp lệ
  } else {
    cb(null, false);
    cb(new Error("Only image and video files are allowed!")); // Lỗi với tệp không hợp lệ
  }
};

// Middleware Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Các route
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
courseRouter.post("/upload", verifyToken, upload.single("file"), uploadFile);

export default courseRouter;
