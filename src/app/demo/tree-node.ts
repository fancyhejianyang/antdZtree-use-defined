import { NzTreeNodeOptions, NzTreeNode } from 'ng-zorro-antd';
import { Renderer2, ElementRef } from '@angular/core';
export class TreeNode {
  nodes: NzTreeNodeOptions[];
  node: NzTreeNodeOptions;
  render: Renderer2;
  pane: Element;
  types = ['', 'node', 'leaf'];
  ref = new ElementRef('span');
  // 添加的节点是否重复
  isReduplicated: boolean;
  constructor(nodes, render2) {
    this.nodes = nodes;
    this.render = render2;
  }
  addNode(pNode: NzTreeNode, type, callback: any) {
    // 所有操作均在非leaf 节点
    console.log(type);
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
  editNode(element: any, pNode: NzTreeNode, callback: any) {
    // 设置可编辑属性
    console.log(pNode);
    console.log(element.getAttribute.contentEditable);
    // if (element.getAttribute.contentEditable) {
    //   element.focus();
    // }
    element.setAttribute('contentEditable', 'true');
    console.log('contendEditable was changed!');
    element.focus();
    element.addEventListener('keyup', (e) => {
      if (e.code === 'Enter') {
        e.target.innerText = e.target.innerText.replace('<br/>', '');
        element.blur();
      }
    });
    element.addEventListener('blur', (e) => {
      console.log('remove contendEditable');
      e.target.innerText = e.target.innerText.replace('<br>', '');
      e.target.removeAttribute('contentEditable');
      console.log('element attribute:', e.target);
      // 获取value 并更新data
      pNode.origin.title = e.target.innerText;
      callback(this.nodes);
    });
  }
  // addEventsOnTargetelement(element: Element) {
  //   console.log(element);
  // }
  // removePane() {
  //   if (this.pane) {
  //     this.render.removeChild(this.pane.parentElement, this.pane);
  //   }
  // }
  // createOptionPane(target: Element, pNode: NzTreeNode, callback: any) {
  //   // 所有操作均在非leaf 节点 ; 目标元素为span
  //   if (pNode.origin.isLeaf) {
  //     this.removePane();
  //     return;
  //   }
  //   if (target.nodeName !== 'SPAN' && !target.classList.contains('ant-tree-title')) {
  //     this.removePane();
  //     return;
  //   }
  //   // 移除旧的Pane
  //   this.removePane();
  //   this.pane = this.render.createElement('span');
  //   this.pane.classList.add('option-btn-pane');
  //   const [btn1, btn2, btn3] = [
  //     this.render.createElement('button'),
  //     this.render.createElement('button'),
  //     this.render.createElement('button')
  //   ];
  //   const [text1, text2, text3] = [
  //     this.render.createText('编辑'),
  //     this.render.createText('add node'),
  //     this.render.createText('add leaf')
  //   ];
  //   [btn1, btn2, btn3].forEach((item, index) => {
  //     // 添加阻止冒泡的机制
  //     item.addEventListener('click', (e: MouseEvent) => {
  //       console.log('btn click');
  //       if (e.stopPropagation) {
  //         e.stopPropagation();
  //       } else {
  //         e.cancelBubble = true;
  //       }
  //       // 添加
  //       if (index === 0) {
  //         this.editNode(target, pNode, callback);
  //       } else {
  //         this.addNode(pNode, this.types[index], callback);
  //         callback(this.nodes);
  //       }
  //     });
  //   });
  //   this.render.appendChild(btn1, text1);
  //   this.render.appendChild(btn2, text2);
  //   this.render.appendChild(btn3, text3);

  //   this.render.appendChild(this.pane, btn1);
  //   this.render.appendChild(this.pane, btn2);
  //   this.render.appendChild(this.pane, btn3);
  //   this.render.appendChild(target.parentElement, this.pane);
  //   console.log(this.render);
  //   // this.addOptionPane(target);
  //   // target.parentElement.classList.add('option');
  // }
  private getRootNode(node: NzTreeNode) {
    if (node.parentNode === null) {
      this.nodes = node.origin;
    } else {
      this.getRootNode(node.parentNode);
    }

  }
  private setNode(type: string) {
    // 同级node中是否有已经添加的默认节点 index 自增
    if (type === 'node') {
      this.node = {
        title: `parent`,
        key: 'key',
        isLeaf: false,
        children: []
      };
    } else {
      this.node = {
        title: 'leaf',
        key: 'key',
        isLeaf: true
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
  // private isExistInParentNode(parent: NzTreeNodeOptions, self: NzTreeNodeOptions): any {
  //   let existParentNode;
  //   if (!parent.parentNode) {
  //     return false;
  //   }
  //   existParentNode = true;
  //   return existParentNode;
  // }
  private checkNodeKey(parent, node) {
    this.getIndexInParentNode(parent, node);
  }
}
