import express from "express";
const wordRouter = express.Router();

import verifyToken from "../middleware/auth";
import {
  create,
} from "../controllers/wordController";

wordRouter.post("/create", verifyToken, create);

export default wordRouter;
