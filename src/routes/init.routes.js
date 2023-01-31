import adminRouter from './admin.js';
import authRouter from './auth.js';
import courseRouter from './course.js';
import examRouter from './exam.js';
import progressRouter from './progress.js';
import wordRouter from './word.js';

const initRoutes = (app) => {
    app.use("/api/admin", adminRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/courses", courseRouter);
    app.use("/api/words", wordRouter)
    app.use("/api/progress", progressRouter);
    app.use("/api/exams", examRouter);
}
export default initRoutes;