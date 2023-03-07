import { Card } from 'antd';
import React, { useState, useEffect, Children } from 'react';

export interface LeftSideContentContainerProps {
  title?: string;
  children?: React.ReactNode;
}

const LeftSideContentContainer: React.FC<LeftSideContentContainerProps> = (props) => {
  const { title, children } = props;

  return (
    <Card className="t-min-w-0 t-flex-1 t-rounded-none" title={title}>
      {children}
    </Card>
  );
};

export default LeftSideContentContainer;
