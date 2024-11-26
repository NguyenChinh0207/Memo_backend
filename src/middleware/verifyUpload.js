import multer from "multer";
import pkg from "uuid";

const DIR = "./src/public/uploads/images";
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
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      res.status(422).json({
        code: 422,
        message:
          "Định dạng file không đúng. Vui lòng tải lên định dạng .png, .jpg, .jpeg !",
      });
      next();
    }
  },
});

export default verifyUpload;
