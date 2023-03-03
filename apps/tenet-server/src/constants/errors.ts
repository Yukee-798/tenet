export const ERROR_MESSAGE_DIRECTORY = {
  USERNAME_OR_PASSWORD_IS_REQUIRED: {
    status: 400,
    message: "用户名或密码不能为空",
    message_en: "Username or password is required",
  },
  USERNAME_OR_PASSWORD_IS_INCORRECT: {
    status: 400,
    message: "用户名或密码错误",
    message_en: "Username or password is incorrect",
  },
  USER_ALREADY_EXISTS: {
    status: 409,
    message: "用户名已存在",
    message_en: "User already exists",
  },
};

export type ErrorMessage = keyof typeof ERROR_MESSAGE_DIRECTORY;
