import { DSL, DSLNode } from './TenetFormRenderer';
export interface TraverseHandler {
    /** key 值为 DSL 每个节点的 type 属性取值 */
    visitor?: Record<string, (context: TraverseContext) => void>;
    pre?: (context: TraverseContext) => void;
    post?: (context: TraverseContext) => unknown;
}
/** 遍历 DSL 时的上下文，记录了部分遍历过程中的上下文信息，支持自定义扩展 */
export declare class TraverseContext {
    /** 内部属性，禁止外部访问 */
    _shouldSkip: boolean;
    /** 内部属性，禁止外部访问 */
    _shouldStop: boolean;
    /** 内部属性，禁止外部访问 */
    _currentNode: DSLNode;
    getCurrentNode(): DSLNode;
    getCurrentNodeLevel(): string;
    /** 跳过当前节点之后的所有子节点，下次遍历会从其下一个兄弟节点开始 */
    skip(): void;
    /** 当前节点遍历完后，将停止遍历 */
    stop(): void;
    traverse: (visitor: TraverseHandler['visitor']) => void;
    [prop: string]: unknown;
}
export default class TenetDSLTraverser {
    private static traverserInstance;
    static createTraverse(): TenetDSLTraverser;
    traverse(dsl: DSL, handler: TraverseHandler): unknown;
}
export declare const createTraverser: typeof TenetDSLTraverser.createTraverse;
