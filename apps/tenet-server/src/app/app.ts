import Koa from "koa";
import { koaBody } from "koa-body";
import catchError from "../middlewares/catchError";
import { userRouter } from "../routers/userRouter";

const app = new Koa();

/**
 * what: 用于打印错误日志到服务器本地控制台
 *
 * why: 因为返回给客户端的错误是经过处理的，没有包含所有错误，所以需要在服务器本地打印错误日志
 */
app.on("error", (err, ctx) => {
  console.log(err);
});

app
  .use(catchError)
  .use(
    koaBody({
      multipart: true,
    })
  )
  .use(userRouter.routes())
  .use(userRouter.allowedMethods());

export default app;
