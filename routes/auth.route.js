import express from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/auth.controller.js";

import { authMiddleware } from "../middleware/auth.middleware.js";
const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/logout", logoutController);
authRouter.get("/checkuser", authMiddleware, () => {
  console.log(`checking user`);
});

export default authRouter;
