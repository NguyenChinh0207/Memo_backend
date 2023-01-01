import authRouter from './auth';
import courseRouter from './course';
import wordRouter from './word';

const initRoutes = (app) => {
    app.use("/api/auth", authRouter);
    app.use("/api/courses", courseRouter);
    app.use("/api/words", wordRouter)
}
export default initRoutes;