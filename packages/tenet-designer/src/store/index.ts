import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import 'immer';

export type Middlewares = [
  ['zustand/devtools', never],
  ['zustand/immer', never]
  // ['zustand/persist', GlobalState]
];

export type GlobalStore = {
  jsonStr: string;
  setJSONStr(value: string): void;
};

const useBoundStore = create<GlobalStore>()(
  // persist(
  immer(
    devtools(
      (set, get, store) => ({
        jsonStr: `[
  {
    "id": "0-0:9e19a3237dcc",
    "type": "page",
    "children": [
      {
        "id": "1-0:16065c72903b",
        "type": "form",
        "state": {
          "username": "YoYo",
          "name": "Richard",
          "email": "12941272123@qq.com",
          "gender": 1,
          "birthday": "2006-8-18",
          "address": "110102",
        },
        "children": [
          {
            "id": "2-0:7e1b22d17dcc",
            "type": "input-text",
            "props": {
              "name": "username",
              "label": "用户名",
              "value": "\${username}",
              "required": true,
            },
          },
          {
            "id": "2-1:3e1a2fd3bdcc",
            "type": "input-text",
            "props": {
              "name": "name",
              "label": "姓名",
              "value": "\${name}",
              "required": true,
            },
          },
          {
            "id": "2-2:9e2a2bda7dcc",
            "type": "input-email",
            "props": {
              "name": "email",
              "label": "邮箱",
              "value": "\${email}",
              "required": true,
            },
          },
          {
            "id": "2-3:221a2bd37dcc",
            "type": "select",
            "props": {
              "name": "gender",
              "label": "性别",
              "options": [
                {
                  "label": "男",
                  "value": 1,
                },
                {
                  "label": "女",
                  "value": 2,
                },
                {
                  "label": "不公开",
                  "value": 3,
                },
              ],
              "value": "\${name}",
            },
          },
          {
            "id": "2-4:4e132ad37dcc",
            "type": "date-picker",
            "props": {
              "name": "birthday",
              "label": "生日",
              "value": "\${birthday}",
              "required": true,
            },
          },
          {
            "id": "2-5:1e1a23d3bdcc",
            "type": "cascader",
            "props": {
              "name": "address",
              "label": "地址",
              "value": "\${address}",
              "required": true,
              "api": {
                "type": "init",
                "method": "GET",
                "url": "https://unpkg.com/china-location/dist/location.json",
              },
            },
          },
        ],
      },
    ],
  },
]`,
        setJSONStr: (jsonStr: string) => {
          set((state) => {
            state.jsonStr = jsonStr;
          });
        },
      }),
      {
        name: 'myStore',
      }
    )
  )
  // {
  //   name: "bear",
  // }
  // )
);

export default useBoundStore;
