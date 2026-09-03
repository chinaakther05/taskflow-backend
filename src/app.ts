import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { authRoutes } from "./modules/auth/auth.routes";
import errorHandler from "./middlewares/errorHandler.middleware";

const app : Application = express();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/', (req : Request, res : Response) => {
    res.send('Welcome to TaskFlow API');
})



app.use("/api/auth", authRoutes);




app.use(errorHandler);

export default app;