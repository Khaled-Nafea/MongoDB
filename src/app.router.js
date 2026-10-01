import { connectDB } from "./DB/connection.js";
import { booksRouter } from "./Modules/Books/index.js";
import { authorsRouter } from "./Modules/Authors/index.js";
import { logsRouter } from "./Modules/Logs/index.js";



export const bootstrap = async (app,express) => {
    app.use(express.json());
    await connectDB();

    app.get("/", (_req, res) => {
        return res.json({ message: "Welcome to the API" });
    });

    app.use('/api/v1/', booksRouter);
    app.use('/api/v1/', authorsRouter);
    app.use('/api/v1/', logsRouter);

    app.all("/*dummy", (_req, res) => {
        return res.status(404).json({ message: "API not found" });
    });
};