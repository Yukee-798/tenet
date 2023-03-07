import { Form, Input } from 'antd';
import React, { useState, useEffect } from 'react';
import GridLayout from 'react-grid-layout';

export interface CanvasProps {
  children?: React.ReactNode | React.ReactNode[];
}

const Canvas: React.FC<CanvasProps> = (props) => {
  const { children } = props;

  const layout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
    { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: 'c', x: 4, y: 0, w: 1, h: 2 },
    { i: 'd', x: 0, y: 4, w: 4, h: 4 },
  ];
  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
      onDrag={() => {}}
    >
      <div key="d" className="t-bg-blue-400">
        <Form>
          <Form.Item>
            <Input />
          </Form.Item>
        </Form>
      </div>
      <div key="a" className="t-bg-green-400">
        a
      </div>
      <div key="b" className="t-bg-blue-400">
        b
      </div>
      <div key="c" className="t-bg-purple-400">
        c
      </div>
    </GridLayout>
  );
};

export default Canvas;
