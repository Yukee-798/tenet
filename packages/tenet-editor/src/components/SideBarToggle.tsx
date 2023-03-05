import React, { useState, useEffect } from 'react';

export interface SideBarToggleProps {
  toggle?: boolean;
  onClick?: () => void;
}

const SideBarToggle: React.FC<SideBarToggleProps> = (props) => {
  const { toggle, onClick } = props;

  return (
    <div
      className="t-flex t-items-center t-w-3 t-h-12 t-absolute -t-right-2 t-top-1/2 t-rounded-r-2xl t-bg-white t-select-none t-cursor-pointer"
      onClick={() => onClick?.()}
    >
      {toggle ? '<' : '>'}
    </div>
  );
};

export default SideBarToggle;
