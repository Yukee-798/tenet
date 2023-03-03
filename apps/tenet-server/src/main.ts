import app from "./app/app";
import { APP_PORT } from "./constants/configs";

app.listen(APP_PORT, () => {
  console.log(`服务器在 ${process.env.APP_PORT} 端口启动`);
});
