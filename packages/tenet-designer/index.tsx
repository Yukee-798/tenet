import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { TenetFormRenderer } from '@tenet/core';
import useBoundStore from './src/store';
import LeftSideBar from './src/components/LeftSideBar';
import Canvas from './src/components/Canvas';
import './index.css';

const { Header, Content } = Layout;

const RenderContent = (props: any) => {
  const [element, setElement] = useState(<div>loading</div>);
  useEffect(() => {
    const renderer = new TenetFormRenderer(props.jsonStr);
    renderer.render().then((res) => {
      setElement(res as JSX.Element);
    });
    // .catch((err) => {});
  }, [props.jsonStr]);
  return element;
};

const TenetDesigner: React.FC = () => {
  const { jsonStr } = useBoundStore((store) => ({
    jsonStr: store.jsonStr,
  }));

  return (
    <div className="tenet-designer">
      <Layout>
        <Header className="header">
          <div className="logo" />
        </Header>
        <Layout>
          <LeftSideBar />
          <Layout>
            <Content
              style={{
                padding: 24,
                margin: 0,
                minHeight: 280,
              }}
            >
              <Canvas>
                {/* <React.Suspense fallback={<div>loading...</div>}>{parse(dsl)}</React.Suspense> */}
                <RenderContent jsonStr={jsonStr} />
                {/* <FormilyDemo /> */}
              </Canvas>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
};

export default TenetDesigner;
