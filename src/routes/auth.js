import express from "express";
const authRouter = express.Router();
import { login, register, forgotPassword } from "../controllers/authController";

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
  
export default authRouter;
