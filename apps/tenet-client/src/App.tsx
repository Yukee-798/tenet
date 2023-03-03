import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { TenetFormRenderer } from '@tenet/core';
import Canvas from './components/tenet-editor/Canvas';
import LeftSideBar from './components/tenet-editor/LeftSideBar';
import useBoundStore from './store';

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

const App: React.FC = () => {
  const { jsonStr } = useBoundStore((store) => ({
    jsonStr: store.jsonStr,
  }));

  return (
    <div className="App">
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

export default App;
