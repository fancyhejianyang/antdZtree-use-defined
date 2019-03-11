import { NzTreeNodeOptions, NzTreeNode } from 'ng-zorro-antd';
import { Renderer2 } from '@angular/core';
export class TreeNode {
  nodes: NzTreeNodeOptions[];
  node: NzTreeNodeOptions;
  render: Renderer2;
  // 添加的节点是否重复
  isReduplicated: boolean;
  constructor(nodes) {
    this.nodes = nodes;
  }
  addNode(pNode: NzTreeNode, type, callback: any) {
    // 所有操作均在非leaf 节点
    if (pNode.origin.isLeaf) {
      return;
    }
    // 设置默认添加模板
    this.setNode(type);
    this.checkNodeKey(pNode, this.node);
    pNode.origin.children = [...pNode.origin.children, this.node];
    this.getRootNode(pNode);
    callback(this.nodes);
  }
  showOptionDisplay() {
    // this.render.createElement('<span></span>');
  }
  editNode(element: any) {
    // 设置可编辑属性
    element.setAttribute('contentEditable', 'true');
    element.focus();
    element.addEventListener('keyup', (e) => {
      if (e.code === 'Enter') {
        console.log('enter');
        e.preventDefault();
      }
    });
    element.addEventListener('blur', (e) => {
      console.log(e.target[0]);
      element.removeAttribute('contentEditable');
    });
    // 获取value 并更新data
  }
  getTargetNode(target: Element) {
    console.log(target);
    // this.editNode(target);
    console.log(target.parentElement);
    const span = new HTMLSpanElement();
    span.innerHTML = '编辑';
    target.parentElement.appendChild(span);
  }
  private getRootNode(node: NzTreeNode) {
    if (node.parentNode === null) {
      this.nodes = node.origin;
    } else {
      this.getRootNode(node.parentNode);
    }

  }
  private setNode(type: string) {
    if (type === 'node') {
      this.node = {
        title: 'node',
        key: 'key',
        isLeaf: false,
        children: []
      };
    } else {
      this.node = {
        title: 'leaf',
        key: 'key',
      };
    }
  }
  private getIndexInParentNode(parent: NzTreeNodeOptions, self: NzTreeNodeOptions): any {
    let exist = false;
    parent.origin.children.forEach((element, index) => {
      if (element.key === self.key) {
        exist = true;
      }
    });
    this.isReduplicated = Boolean(exist);
    // return this.isReduplicated;
  }
  private isExistInParentNode(parent: NzTreeNodeOptions, self: NzTreeNodeOptions): any {
    let existParentNode;
    if (!parent.parentNode) {
      return false;
    }
    existParentNode = true;
    return existParentNode;
  }
  private checkNodeKey(parent, node) {
    // const existParentNode = this.isExistInParentNode(parent, node);
    // const index = !this.isReduplicated;
    // console.log('existParentNode:' + existParentNode);
    this.getIndexInParentNode(parent, node);
  }
}
