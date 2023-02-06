import express from "express";
import { createUnit, deleteUnit, editUnit, getUnitsByCourseId } from "../controllers/unitController.js";
const unitRouter = express.Router();

import verifyToken from "../middleware/auth.js";

unitRouter.post("/create", verifyToken, createUnit);
unitRouter.post("/edit", verifyToken, editUnit);
unitRouter.post("/", verifyToken, getUnitsByCourseId);
unitRouter.post("/delete", verifyToken, deleteUnit);

export default unitRouter;
