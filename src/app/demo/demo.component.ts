import { Component, OnInit, ViewChild } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNodeOptions, NzTreeComponent } from 'ng-zorro-antd';
import { TreeNode } from './tree-node';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.scss']
})
export class DemoComponent implements OnInit {
  @ViewChild('treeCom') treeCom: NzTreeComponent;
  nodes: NzTreeNodeOptions[] = [{
    title: 'parent 1',
    key: '100',
    children: [
      {
        title: 'parent 2',
        key: '1001',
        disabled: false,
        children: [
          { title: 'leaf 1-0-0', key: '10010', isLeaf: true },
          { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
        ]
      },
      {
        title: 'parent 1-1',
        key: '1002',
        children: [
          { title: 'leaf 1-1-0', key: '10020', isLeaf: true },
          { title: 'leaf 1-1-1', key: '10021', isLeaf: true },
          { title: 'leaf 1-1-2', key: '10022', isLeaf: false, children: [] }
        ]
      }
    ]
  }];
  treeNodes: TreeNode;
  constructor() { }

  ngOnInit() {
    this.treeNodes = new TreeNode(this.nodes);
  }
  nzClick(e: NzFormatEmitEvent) {
    console.log(e);
  }
  nzCheck(e: NzFormatEmitEvent) {
    console.log(e);
  }
  nzSelect(keys: string[]): void {
    console.log(keys, this.treeCom.getSelectedNodeList());
  }
  dbClick(e: NzFormatEmitEvent) {
    console.log(e);
  }
  contentMenu(e: NzFormatEmitEvent) {
    // console.log(e.event.target);
    this.treeNodes.getTargetNode(e.event.srcElement);
    // 类型 节点node 文件 leaf string类型
    // this.treeNodes.addNode(e.node, 'node', (newNode: []) => {
    //   const obj = cloneDeep(newNode);
    //   this.nodes = [obj];
    // });
  }
}
