/*
  1. 先将 DSL 转化为 formily 的 schema
  2. 得到 formily 的 schema 后，将其填充到 SchemaField 的 schema 属性中，即可在 Canvas 中渲染出表单组件
  3.
*/
import React from 'react';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Card } from 'antd';
import { Form, FormItem, FormLayout, Submit, FormGrid, ArrayItems, FormButtonGroup, } from '@formily/antd';
import { createParser } from './TenetJSONStrParser';
import { createTraverser } from './TenetDSLTraverser';
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
    dsl = [];
    jsonStrParseErrorList = [];
    form;
    schema = {};
    parser = createParser();
    dslTraverser = createTraverser();
    defaultUsedFormilyComponents = { FormItem, FormGrid, FormLayout, ArrayItems };
    /** BasicData */
    nodeTypes = [];
    /** BasicData */
    flatNodes = [];
    constructor(jsonStr, options) {
        this.form = createForm(options);
        this.parser.parse(jsonStr, (dsl) => {
            this.dsl = dsl;
        }, (errorInfoList) => {
            this.jsonStrParseErrorList = errorInfoList;
        });
        this.updateBasicData();
        this.transformTenetDSLToFormilySchema();
        this.initFormValuesByDSLState();
    }
    getSchema() {
        return this.schema;
    }
    updateBasicData() {
        this.dslTraverser.traverse(this.dsl, {
            pre: (context) => {
                context.nodeTypes = new Set();
            },
            visitor: {
                [`*`]: (context) => {
                    const node = context.getCurrentNode();
                    this.flatNodes.push(node);
                    context.nodeTypes.add(node.type);
                },
            },
            post: (context) => {
                this.nodeTypes = Array.from(context.nodeTypes);
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
        const schema = {
            type: 'object',
            properties: {},
        };
        // TODO: 目前只支持了一个页面中只有一个 form 的情况
        const flatNodes = this.getFlatNodes();
        const formNode = flatNodes.find((node) => node.type === 'form');
        const formItemNodes = formNode?.children || [];
        for (const formItemNode of formItemNodes) {
            // TODO: 设计 FormItemProps 的类型
            const { name, label, required, value, options } = formItemNode.props;
            // TODO: schema.properties 的 key 顺序问题，需要和 jsonStr 里面的一致
            schema.properties[name] = {
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
    initFormValuesByDSLState() {
        // TODO: 目前只支持了一个页面中只有一个 form 的情况
        const flatNodes = this.getFlatNodes();
        const formNode = flatNodes.find((node) => node.type === 'form');
        console.log('🚀 ~ formNode:', formNode);
        const formState = formNode?.state || {};
        // console.log();
        this.form.initialValues = {
            ...formState,
        };
    }
    async getUsedFormilyComponents() {
        const tenetDSLNodeTypes = this.getNodeTypes();
        // TODO: key 应该为 string union
        const components = {
            ...this.defaultUsedFormilyComponents,
        };
        for (const type of tenetDSLNodeTypes) {
            const formilyComponentDisplayName = TenetFormNodeTypesToFormilyMap[type];
            if (!formilyComponentDisplayName)
                continue;
            // TODO: 这里暂时这样处理，因为动态导入并且需要插入变量时会有下面的限制，后续可以考虑自定义 vite plugin
            // 就算遵循下面的限制，使用 import(`../node_modules/@formily/antd/esm/${formilyComponentDisplayName}/index.js`)
            // 也会因为 vite 给 react ejs 转换 esm 过程中有问题，导致 ReactDOM/createPortal 模块引入有问题
            // https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
            // vite 插件可以参考 https://github.com/vite-plugin/vite-plugin-dynamic-import
            switch (formilyComponentDisplayName) {
                case 'Input': {
                    components[formilyComponentDisplayName] = (await import('@formily/antd/esm/input')).default;
                    break;
                }
                case 'Select': {
                    components[formilyComponentDisplayName] = (await import('@formily/antd/esm/select')).default;
                    break;
                }
                case 'Cascader': {
                    components[formilyComponentDisplayName] = (await import('@formily/antd/esm/cascader')).default;
                    break;
                }
                case 'DatePicker': {
                    components[formilyComponentDisplayName] = (await import('@formily/antd/esm/date-picker')).default;
                    break;
                }
                default:
                    throw new Error(`未知的组件: ${formilyComponentDisplayName}`);
            }
        }
        return components;
    }
    async createFormilySchemaField() {
        const usedFormilyComponents = await this.getUsedFormilyComponents();
        return createSchemaField({
            components: usedFormilyComponents,
        });
    }
    async render() {
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
        return React.createElement(Card, {
            title: '表单',
            style: {
                width: 620,
            },
        }, React.createElement(Form, {
            form: this.form,
            labelCol: 5,
            wrapperCol: 16,
            onAutoSubmit: console.log,
        }, React.createElement(SchemaField, {
            schema: this.schema,
        }), React.createElement(FormButtonGroup.FormItem, {}, React.createElement(Submit, {
            block: true,
            size: 'large',
        }, '提交'))));
    }
}
//# sourceMappingURL=TenetFormRenderer.js.map