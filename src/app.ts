import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import dotenv from "dotenv";
import router from "./routes";
import multer from "multer";
import logger from "morgan";
import { errorResponse } from "@/helpers/respose.helper";
import { appConfig } from "./config/app.config";
import "./register-alias";
import redisClient from "@/config/redis.config";

dotenv.config();

const port = appConfig.port;
const publicPath = path.join(__dirname, "../public");
const app = express();
redisClient.connect();
app.use(express.json());
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(publicPath));
app.use("/", router);

app.use((err: any, req: Request, res: Response, next: any) => {
  if (err instanceof multer.MulterError) {
    errorResponse(res, err.message, null, 500);
  } else if (err) {
    errorResponse(res, err.message, null, 400);
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(`${appConfig.name} Server is up on port ${port}`);
});
export default app;
