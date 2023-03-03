import app from "../app/app";
import { ErrorMessage } from "../constants/errors";

/** 
 * what: 抛出错误只能使用该方法
 * 
 * how: 基于 koa 的 throw 方法，封装了一层
 * 
 * why: 便于统一处理错误信息
 */
export default function throwError(message: ErrorMessage) {
  app.context.throw(message);
}