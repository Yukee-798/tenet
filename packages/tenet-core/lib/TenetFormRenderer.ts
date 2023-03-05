/*
  1. 先将 DSL 转化为 formily 的 schema
  2. 得到 formily 的 schema 后，将其填充到 SchemaField 的 schema 属性中，即可在 Canvas 中渲染出表单组件
  3.
*/
import React from 'react';
import { createForm } from '@formily/core';
import { createSchemaField, JSXComponent } from '@formily/react';
import { observable, action } from '@formily/reactive';
import { observer } from '@formily/reactive-react';
import { Card, Button, Spin } from 'antd';
import {
  Form,
  FormItem,
  FormLayout,
  Submit,
  FormGrid,
  ArrayItems,
  FormButtonGroup,
} from '@formily/antd';
import TenetJSONStrParser, { createParser } from './TenetJSONStrParser';
import TenetDSLTraverser, { createTraverser } from './TenetDSLTraverser';
import type { IFormProps } from '@formily/core';
import type { ISchema } from '@formily/react';
import type { ParseError } from './TenetJSONStrParser';

export type DSLNode = {
  id: string;
  type: string; // TODO: 使用 union type, <T extends DSLNodeTypes>
  state?: Record<string, unknown>;
  props?: Record<string, unknown>; // TODO: Record<string, TenetUIProps
  children?: DSLNode[];
};

/** 表示一个完整的 DSL，与 DSLNode 区别在于 DSL 一定是数组类型 */
export type DSL = DSLNode[];

export const TenetFormNodeTypesToFormilyMap = {
  'input-text': 'Input',
  'input-email': 'Input',
  'input-password': 'Input',
  'input-number': 'Input',
  'input-textarea': 'Input',
  'input-phone': 'Input',
  select: 'Select',
  cascader: 'Cascader',
  'date-picker': 'DatePicker',
};

export class TenetFormRenderer {
  /** 整个应用的生命周期中，内存里面只有一份 dsl */
  private dsl: DSL = [];
  private jsonStrParseErrorList: ParseError[] = [];
  private form: ReturnType<typeof createForm>;
  private schema: ISchema = {};
  private parser: TenetJSONStrParser = createParser();
  private dslTraverser: TenetDSLTraverser = createTraverser();
  private defaultUsedFormilyComponents = { FormItem, FormGrid, FormLayout, ArrayItems };

  /** BasicData */
  private nodeTypes: string[] = [];
  /** BasicData */
  private flatNodes: DSLNode[] = [];

  constructor(jsonStr: string, options?: IFormProps) {
    this.form = createForm(options);
    this.parser.parse(
      jsonStr,
      (dsl) => {
        this.dsl = dsl;
      },
      (errorInfoList) => {
        this.jsonStrParseErrorList = errorInfoList;
      }
    );

    this.updateBasicData();
    this.transformTenetDSLToFormilySchema();
    this.initFormValuesByDSLState();
  }

  getSchema() {
    return this.schema;
  }

  updateBasicData() {
    type NodeTypes = Set<DSLNode['type']>;
    this.dslTraverser.traverse(this.dsl, {
      pre: (context) => {
        context.nodeTypes = new Set() as NodeTypes;
      },
      visitor: {
        [`*`]: (context) => {
          const node = context.getCurrentNode();
          this.flatNodes.push(node);
          (context.nodeTypes as NodeTypes).add(node.type);
        },
      },
      post: (context) => {
        this.nodeTypes = Array.from(context.nodeTypes as NodeTypes);
      },
    });
  }

  getNodeTypes() {
    return this.nodeTypes;
  }

  getFlatNodes() {
    return this.flatNodes;
  }

  transformTenetDSLToFormilySchema() {
    const schema: ISchema = {
      type: 'object',
      properties: {},
    };

    // TODO: 目前只支持了一个页面中只有一个 form 的情况
    const flatNodes = this.getFlatNodes();
    const formNode = flatNodes.find((node) => node.type === 'form');
    const formItemNodes = formNode?.children || [];

    for (const formItemNode of formItemNodes) {
      // TODO: 设计 FormItemProps 的类型
      const { name, label, required, value, options } = formItemNode.props as {
        name: string;
        label: string;
        required: boolean;
        value: unknown;
        options: { label: string; value: string }[];
      };

      // TODO: schema.properties 的 key 顺序问题，需要和 jsonStr 里面的一致
      schema.properties![name] = {
        type: 'string',
        title: label,
        enum: options,
        required,
        'x-decorator': 'FormItem',
        'x-component': TenetFormNodeTypesToFormilyMap[formItemNode.type],
      };
    }

    this.schema = schema;
  }

  private initFormValuesByDSLState() {
    // TODO: 目前只支持了一个页面中只有一个 form 的情况
    const flatNodes = this.getFlatNodes();
    const formNode = flatNodes.find((node) => node.type === 'form');
    console.log('🚀 ~ formNode:', formNode);
    const formState = (formNode?.state as { [key: string]: unknown }) || {};
    // console.log();

    this.form.initialValues = {
      ...formState,
    };
  }

  private async getUsedFormilyComponents() {
    const tenetDSLNodeTypes = this.getNodeTypes();
    // TODO: key 应该为 string union
    const components: Record<string, JSXComponent> = {
      ...this.defaultUsedFormilyComponents,
    };

    for (const type of tenetDSLNodeTypes) {
      const formilyComponentDisplayName = TenetFormNodeTypesToFormilyMap[type] as string;

      if (!formilyComponentDisplayName) continue;

      // TODO: 这里暂时这样处理，因为动态导入并且需要插入变量时会有下面的限制，后续可以考虑自定义 vite plugin
      // 就算遵循下面的限制，使用 import(`../node_modules/@formily/antd/esm/${formilyComponentDisplayName}/index.js`)
      // 也会因为 vite 给 react ejs 转换 esm 过程中有问题，导致 ReactDOM/createPortal 模块引入有问题
      // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
      // vite 插件可以参考 https://github.com/vite-plugin/vite-plugin-dynamic-import
      switch (formilyComponentDisplayName) {
        case 'Input': {
          components[formilyComponentDisplayName] = (
            await import('@formily/antd/esm/input')
          ).default;
          break;
        }
        case 'Select': {
          components[formilyComponentDisplayName] = (
            await import('@formily/antd/esm/select')
          ).default;
          break;
        }
        case 'Cascader': {
          components[formilyComponentDisplayName] = (
            await import('@formily/antd/esm/cascader')
          ).default;
          break;
        }
        case 'DatePicker': {
          components[formilyComponentDisplayName] = (
            await import('@formily/antd/esm/date-picker')
          ).default;
          break;
        }
        default:
          throw new Error(`未知的组件: ${formilyComponentDisplayName}`);
      }
    }
    return components;
  }

  private async createFormilySchemaField() {
    const usedFormilyComponents = await this.getUsedFormilyComponents();
    return createSchemaField({
      components: usedFormilyComponents,
    });
  }

  // @ts-ignore
  async render(): Promise<JSX.Element> {
    console.log('执行 render');
    const SchemaField = await this.createFormilySchemaField();

    // return (
    //   <Card title="表单" style={{ width: 620 }}>
    //     <Form form={this.form} labelCol={5} wrapperCol={16} onAutoSubmit={console.log}>
    //       <SchemaField schema={this.schema} />
    //       <FormButtonGroup.FormItem>
    //         <Submit block size="large">
    //           提交
    //         </Submit>
    //       </FormButtonGroup.FormItem>
    //     </Form>
    //   </Card>
    // );

    return React.createElement(
      Card,
      {
        title: '表单',
        style: {
          width: 620,
        },
      },
      React.createElement(
        Form,
        {
          form: this.form,
          labelCol: 5,
          wrapperCol: 16,
          onAutoSubmit: console.log,
        },
        React.createElement(SchemaField, {
          schema: this.schema,
        }),
        React.createElement(
          FormButtonGroup.FormItem,
          {},
          React.createElement(
            Submit,
            {
              block: true,
              size: 'large',
            },
            '提交'
          )
        )
      )
    );
  }
}
