import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: `${process.env.BASE_URL}`,
    credentials: true,
  })
);

const port = process.env.PORT;

app.use("/api/auth", authRouter);

app.listen(port, () => {
  console.log(`Server Running on ${port}`);
});
