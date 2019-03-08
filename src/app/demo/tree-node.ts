import { NzTreeNodeOptions, NzTreeNode } from 'ng-zorro-antd';
export class TreeNode {
  nodes: NzTreeNodeOptions[];
  // 添加的节点是否重复
  isReduplicated: boolean;
  constructor(nodes) {
    this.nodes = nodes;
  }
  addNode(origin: NzTreeNode, node: NzTreeNodeOptions, callback: any) {
    // console.log(origin, node);
    this.isExistInParentNode(origin, node);
    // if (origin.parentNode !== null) {
    //   this.checkNodeKey(origin, node);
    // } else {
    //   // key 唯一
    //   this.checkNodeKey(origin, node);
    //   // this.nodes = [...this.nodes, node];
    //   // console.log(this.nodes);
    // }
    callback(this.nodes);
  }
  private getIndexInParentNode(parent: NzTreeNodeOptions[], self: NzTreeNodeOptions): number {
    let existIndex;
    this.nodes.forEach((element, index) => {
      if (element.key === self.key) {
        existIndex = index;
      }
    });
    return existIndex;
  }
  private isExistInParentNode(parent: NzTreeNodeOptions, self: NzTreeNodeOptions): void {
    // let existIndex;
    if (!parent.parentNode) {
      return null;
    }
    // console.log(parent.parentNode.origin.children);
    parent.parentNode.origin.children.forEach((element, index) => {
      if (element.key === self.key) {
        // existIndex = index;
        this.isReduplicated = true;
      }
    });
    // return existIndex;
  }
  private checkNodeKey(parent, node) {
    // const index = this.isExistInParentNode(parent, node);
    const index = !this.isReduplicated;
    console.log('index=:' + index);
    if (!index) {
      console.log('parent children:', parent.parentNode.origin.children);
      parent.parentNode.origin.children = [...parent.parentNode.origin.children, node];
      console.log('added and now parent children:', parent.parentNode.origin.children);
    } else {
      console.log('node already exist');
      return;
    }
    // console.log(parent);
  }
}
