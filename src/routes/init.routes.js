import adminRouter from './admin';
import authRouter from './auth';
import courseRouter from './course';
import examRouter from './exam';
import progressRouter from './progress';
import wordRouter from './word';

const initRoutes = (app) => {
    app.use("/api/admin", adminRouter);
    app.use("/api/auth", authRouter);
    app.use("/api/courses", courseRouter);
    app.use("/api/words", wordRouter)
    app.use("/api/progress", progressRouter);
    app.use("/api/exams", examRouter);
}
export default initRoutes;