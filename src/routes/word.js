import express from "express";
const wordRouter = express.Router();

import verifyToken from "../middleware/auth";
import {
   updateWords,
} from "../controllers/wordController";

wordRouter.post("/update", verifyToken, updateWords);

export default wordRouter;
