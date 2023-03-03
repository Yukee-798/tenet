import { Middleware } from "koa";
import { ERROR_MESSAGE_DIRECTORY, ErrorMessage } from "../constants/errors";

/**
 * what: 用于处理全局错误的中间件，需要在 app 最顶层注册
 *
 * how:
 * 1. 原理：利用洋葱模型，最先注册的中间件在执行 next 后会挂起，next 后面的代码会在所有中间件执行完后再执行
 * 2. 统一抛出异常的入口：在 utils/throwError.ts 中，只能使用该方法抛出异常
 * 3. 统一抛出的错误信息：在 constants/errors.ts 中，只能使用该文件中的错误信息，并且收敛到了 throwError 函数参数里面
 * 4. 错误处理规则：
 *    - 如果是自定义的错误信息（收敛在 constants/errors.ts）返回 4xx 状态码
 *    - 如果是其他错误信息（服务器内部逻辑错误），返回客户端 500 状态码
 *    - 返回客户端的信息具有: status, message, message_en 三个字段
 *    - 为了方便调试，会将所有错误信息打印到控制台 app.on("error")
 *
 * why: 更方便的处理全局错误信息，便于维护与调试
 */
const catchError: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const { message: msg } = err; 

    console.log(msg);

    if (msg in ERROR_MESSAGE_DIRECTORY) {
      const { status, message, message_en } = ERROR_MESSAGE_DIRECTORY[msg as ErrorMessage];
      ctx.response.status = status;
      ctx.response.body = {
        status,
        message,
        message_en,
      };
    } else {
      ctx.response.status = 500;
      ctx.response.body = {
        status: 500,
        message: "服务器错误",
        message_en: "Server Error",
      };
    }

    ctx.app.emit("error", err, ctx);
  }
};

export default catchError;
