import Router from "koa-router";
import userController from "../controllers/userController";

export const userRouter = new Router({ prefix: "/user" });
userRouter.post("/", userController.register); // 会将 context 和 next 传递给 createUser
