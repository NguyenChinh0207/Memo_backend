import adminRouter from "./admin.js";
import authRouter from "./auth.js";
import courseRouter from "./course.js";
import examRouter from "./exam.js";
import lessonRouter from "./lesson.js";
import progressRouter from "./progress.js";
import unitRouter from "./unit.js";
import wordRouter from "./word.js";

const initRoutes = (app) => {
  app.use("/api/admin/test", (req, res) => {
    console.log("admin endpoint is called");
    // your endpoint logic here
  });
  app.use("/api/admin", adminRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/courses", courseRouter);
  app.use("/api/words", wordRouter);
  app.use("/api/progress", progressRouter);
  app.use("/api/exams", examRouter);
  app.use("/api/units", unitRouter);
  app.use("/api/lessons", lessonRouter);
};
export default initRoutes;
