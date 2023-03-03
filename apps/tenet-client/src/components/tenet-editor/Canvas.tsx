import React, { useState, useEffect } from "react";

export interface CanvasProps {
  children?: React.ReactNode | React.ReactNode[];
}

const Canvas: React.FC<CanvasProps> = (props) => {
  const { children } = props;

  return <div>{children}</div>;
};

export default Canvas;
