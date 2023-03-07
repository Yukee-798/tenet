import React, { useState, useEffect } from 'react';

export interface CanvasElementWrapperProps extends React.PropsWithChildren {
  isSelected?: boolean;
  onClick?: () => void;
}

const CanvasElementWrapper: React.FC<CanvasElementWrapperProps> = (props) => {
  const { isSelected, children, onClick } = props;

  return <div>{children}</div>;
};

export default CanvasElementWrapper;
