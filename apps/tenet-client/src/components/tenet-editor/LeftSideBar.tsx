import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import type { MenuProps } from "antd";
import { AppstoreAddOutlined, BarsOutlined, CodeOutlined } from "@ant-design/icons";
import SideBarToggle from "./SideBarToggle";
import LeftSideContentContainer from "./LeftSideContentContainer";
import JSONEditor from "./JSONEditor";
import useBoundStore from "../../store";

const { Sider } = Layout;

const items: MenuProps["items"] = [AppstoreAddOutlined, BarsOutlined, CodeOutlined].map(
  (icon, index) => {
    const key = String(index + 1);
    return {
      key: `${key}`,
      icon: React.createElement(icon),
    };
  }
);

export enum MenuItemKey {
  ComponentStore = "1",
  PageOutline = "2",
  JSONEditor = "3",
}

const SideContentTitles = {
  [MenuItemKey.ComponentStore]: "组件",
  [MenuItemKey.PageOutline]: "大纲",
  [MenuItemKey.JSONEditor]: "JSON",
};

const LeftSideBarContentWidth = 554;
const LeftSideBarWith = 64;

// export interface LeftSideBarProps {}

const LeftSideBar: React.FC /* <LeftSideBarProps> */ = (props) => {
  // const {} = props;
  const { editorValue, setEditorValue } = useBoundStore((store) => ({
    editorValue: store.jsonStr,
    setEditorValue: store.setJSONStr,
  }));
  const [currentItemKey, setCurrentItemKey] = useState(MenuItemKey.ComponentStore);
  const [isSideBarToggle, setIsSideBarToggle] = useState(true);

  const renderSideBarContent = () => {
    switch (currentItemKey) {
      case MenuItemKey.ComponentStore:
        return <div>{SideContentTitles[currentItemKey]}</div>;
      case MenuItemKey.PageOutline:
        return <div>{SideContentTitles[currentItemKey]}</div>;
      case MenuItemKey.JSONEditor:
        return (
          <JSONEditor
            defaultValue={editorValue}
            onChange={(value) => {
              setEditorValue(value);
            }}
          />
        );
    }
  };

  return (
    <Sider
      className="t-relative"
      width={isSideBarToggle ? LeftSideBarContentWidth : LeftSideBarWith}
    >
      <Menu
        className="t-w-16 t-h-full t-border-r-0"
        mode="inline"
        defaultSelectedKeys={[MenuItemKey.ComponentStore]}
        defaultOpenKeys={[MenuItemKey.ComponentStore]}
        items={items}
        onSelect={({ key }) => setCurrentItemKey(key as MenuItemKey)}
      />
      <LeftSideContentContainer title={`${SideContentTitles[currentItemKey]}`}>
        {renderSideBarContent()}
      </LeftSideContentContainer>
      <SideBarToggle
        toggle={isSideBarToggle}
        onClick={() => {
          setIsSideBarToggle(!isSideBarToggle);
        }}
      />
    </Sider>
  );
};

export default LeftSideBar;
