import dotenv from "dotenv";
import path from "path"; // Thêm module path
import database from "./src/configs/db.configs.js";
import express from "express";
import initRoutes from "./src/routes/init.routes.js";
import cors from "cors";

dotenv.config();

const app = express();
const __dirname = path.resolve(); // Để xử lý đường dẫn tuyệt đối

// Middleware
app.use(express.json());
app.use(cors());

// Phục vụ file tĩnh từ thư mục uploads
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/src/public/uploads", express.static(path.join(__dirname, "/src/public/uploads")));

// Endpoint mặc định
app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

// Kết nối cơ sở dữ liệu
database.connectDatabase();

// Khởi tạo router
initRoutes(app);

const PORT = process.env.PORT;

// Khởi động server
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
