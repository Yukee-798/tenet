import React, { useState, useEffect } from "react";
import SideTabBar from "./src/components/SideTabBar";

export interface indexProps {}

export const TenetEditor: React.FC<indexProps> = (props) => {
  const {} = props;

  return (
    <div>
      <SideTabBar />
    </div>
  );
};
