import express from "express";
const adminRouter = express.Router();
import verifyToken from "../middleware/auth";
import {
  listUsers,
} from "../controllers/authController";

adminRouter.post("/users", verifyToken, listUsers);

export default adminRouter;
