import multer from "multer";
import pkg from "uuid";

const DIR = "./src/public/uploads/media"; // Đổi tên thư mục để chứa cả ảnh và video
const { v4: uuid } = pkg;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, `${uuid()}-${fileName}`);
  },
});

const verifyUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Kiểm tra loại tệp (ảnh và video)
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "video/mp4" ||
      file.mimetype == "video/avi" ||
      file.mimetype == "video/mkv"
    ) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Please upload .png, .jpg, .jpeg for images or .mp4, .avi, .mkv for videos."
        )
      );
    }
  },
});

export default verifyUpload;
