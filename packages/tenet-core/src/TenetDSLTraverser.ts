import { DSL, DSLNode } from './TenetFormRenderer';

export interface TraverseHandler {
  /** key 值为 DSL 每个节点的 type 属性取值 */
  visitor?: Record<string, (context: TraverseContext) => void>;
  pre?: (context: TraverseContext) => void;
  post?: (context: TraverseContext) => unknown;
}

/** 遍历 DSL 时的上下文，记录了部分遍历过程中的上下文信息，支持自定义扩展 */
export class TraverseContext {
  /** 内部属性，禁止外部访问 */
  _shouldSkip = false;
  /** 内部属性，禁止外部访问 */
  _shouldStop = false;
  /** 内部属性，禁止外部访问 */
  _currentNode!: DSLNode;
  getCurrentNode() {
    return this._currentNode;
  }
  getCurrentNodeLevel() {
    return this._currentNode.id.split(':')[0];
  }
  /** 跳过当前节点之后的所有子节点，下次遍历会从其下一个兄弟节点开始 */
  // TODO: 这里的 skip 和 stop 的思想不一样，skip 实际上是忽略 visitor 对子节点的访问，实际上还是会去遍历子节点的，但是 stop 这是会直接停止遍历，不会再去遍历子节点
  skip() {
    this._shouldSkip = true;
  }
  /** 当前节点遍历完后，将停止遍历 */
  stop() {
    this._shouldStop = true;
  }
  traverse: (visitor: TraverseHandler['visitor']) => void = () => {
    // TODO: 实现 traverse 方法
    throw new Error('traverse is not implemented');
  };
  [prop: string]: unknown;
}

export default class TenetDSLTraverser {
  private static traverserInstance: TenetDSLTraverser;
  static createTraverse() {
    if (!TenetDSLTraverser.traverserInstance) {
      TenetDSLTraverser.traverserInstance = new TenetDSLTraverser();
      return TenetDSLTraverser.traverserInstance;
    }
    return TenetDSLTraverser.traverserInstance;
  }

  traverse(dsl: DSL, handler: TraverseHandler): unknown {
    /** 每次遍历都的具有其单独的上下文 */
    const context = new TraverseContext();

    handler?.pre?.(context);

    (function dfs(children: DSLNode[] | undefined) {
      if (!children || context._shouldStop) return;

      for (const node of children) {
        const nodeType = node.type;

        // 只访问 visitor 指定的节点类型
        if (handler.visitor && nodeType in handler.visitor) {
          if (context._shouldSkip) {
            context._shouldSkip = false;
            continue;
          }
          context._currentNode = node;
          handler.visitor[nodeType](context);
        }

        // visitor 的 key 为 * 时，会访问任意类型节点
        if (handler.visitor && '*' in handler.visitor) {
          if (context._shouldSkip) {
            context._shouldSkip = false;
            continue;
          }
          context._currentNode = node;
          handler.visitor['*'](context);
        }

        dfs(node.children);
      }
    })(dsl);

    return handler?.post?.(context);
  }
}

export const createTraverser = TenetDSLTraverser.createTraverse;
