import React, { useState, useEffect } from 'react';

export interface SideBarToggleProps {
  toggle?: boolean;
  onClick?: () => void;
}

const SideBarToggle: React.FC<SideBarToggleProps> = (props) => {
  const { toggle, onClick } = props;

  return (
    <div
      className="t-absolute -t-right-2 t-top-1/2 t-flex t-h-12 t-w-3 t-cursor-pointer t-select-none t-items-center t-rounded-r-2xl t-bg-white"
      onClick={() => onClick?.()}
    >
      {toggle ? '<' : '>'}
    </div>
  );
};

export default SideBarToggle;
