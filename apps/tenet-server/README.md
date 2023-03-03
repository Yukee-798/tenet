## 前期项目搭建

- 在 node 项目中使用 ts - https://khalilstemmler.com/blogs/typescript/node-starter-project/
- 使用 ESModule + TS 的几个注意事项
  - package.json 添加上 `"type": "module"`
  - tsconfig 需要开启下面选项
    - `"esModuleInterop": true`
    - `"module": "NodeNext"`
  - nodemon 需要使用 `"ts-node-esm ./src/main.ts"`
  - 装好 ts 相关依赖，`ts-node`, `@types/node`, `typescript`
  - 在 import 某个 ts 模块的时候，虽然它是 .ts 文件，但是需要写成 .js，这一点非常的 tricky
- 可以看一下 ts 官方 https://www.typescriptlang.org/docs/handbook/esm-node.html

## 项目目录分层

- app
  - main.ts 是整个项目的入口，那么 app 就是整个应用的入口（比 main.ts 低一级）
  - 在该目录下主要存放对 app 的各种操作，比如 app 创建、中间件绑定、路由注册 
- router
  - 该目录下存放路由，具体业务逻辑需要调用 Controller
- controller
  - 该目录用于接口调用时的逻辑处理，后端的业务代码主要就是写在这里面的
- service
  - 该目录是从 controller 中的部分逻辑再一次抽取出来的
  - 主要用于数据库操作等逻辑
- utils
- main.ts

## 数据库的安装与使用

## 数据库的连接

- 

## 使用 dotenv 将全局常量抽取到 process.env 中

## 用户注册接口实现

### 用户表的设计

## Postman 的基本使用

