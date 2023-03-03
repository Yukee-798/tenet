import dotenv from "dotenv";

dotenv.config();

// 从 .env 文件中读取数据
export const {
  APP_PORT,
  MYSQL_PASSWORD,
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PORT,
  MYSQL_DATABASE,
} = process.env;
