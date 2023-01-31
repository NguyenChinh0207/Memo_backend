import express from "express";
const wordRouter = express.Router();

import verifyToken from "../middleware/auth.js";
import {
   updateWords,
} from "../controllers/wordController.js";

wordRouter.post("/update", verifyToken, updateWords);

export default wordRouter;
