import express from "express";
const authRouter = express.Router();
import verifyToken from "../middleware/auth.js";
import { login, register, forgotPassword, saveUser } from "../controllers/authController.js";

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/save/user", saveUser)
// authRouter.post("/admin/users", verifyToken, list);
  
export default authRouter;
