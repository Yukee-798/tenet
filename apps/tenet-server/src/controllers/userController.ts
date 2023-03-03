import userService from "../services/userService";
import throwError from "../utils/throwError";

class UserController {
  isEmpty(content: any) {
    if (typeof content === "string") {
      return !content.trim();
    } else {
      return !content;
    } 
  }
  // async login(ctx, next) {}
  async register(ctx, next) {
    const { username, password } = ctx.request.body;
    console.log(this);

    if (this.isEmpty(username) || this.isEmpty(password)) {
      throwError("USERNAME_OR_PASSWORD_IS_REQUIRED");
    }

    // const user = await userService.searchUser(username);

    // if (user)

    // const insertRes = await userService.insertUser(username, password);
    // ctx.body = res;
  }
}

export default new UserController();
