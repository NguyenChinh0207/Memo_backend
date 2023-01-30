import express from "express";
import { create, deleteExam, detail, edit, list } from "../controllers/examController";
const examRouter = express.Router();

import verifyToken from "../middleware/auth";

examRouter.post("/create", verifyToken, create);
examRouter.post("/edit", verifyToken, edit);
examRouter.post("/", verifyToken, list);
examRouter.post("/detail", verifyToken, detail);
examRouter.post("/delete", verifyToken, deleteExam);

export default examRouter;