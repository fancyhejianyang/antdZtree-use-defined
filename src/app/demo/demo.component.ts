import { Component, OnInit, ViewChild, Renderer2, TemplateRef } from '@angular/core';
import {
  NzFormatEmitEvent,
  NzTreeNodeOptions,
  NzTreeNode,
  NzTreeComponent,
  NzDropdownService,
  NzDropdownContextComponent,
  NzMessageService
} from 'ng-zorro-antd';
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
  private dropdown: NzDropdownContextComponent;
  treeNodes: TreeNode;
  targetNode: NzTreeNode;
  targetElement: EventTarget;
  types = ['', 'node', 'leaf'];
  constructor(
    private render2: Renderer2,
    private message: NzMessageService,
    private dropdownService: NzDropdownService
  ) { }

  ngOnInit() {
    this.treeNodes = new TreeNode(this.nodes, this.message);
  }
  nzClick(e: NzFormatEmitEvent) {
    // this.treeNodes.removePane();
    if (this.dropdown) {
      this.dropdown.close();
    }
    e.event.preventDefault();
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
  contentMenu(e: NzFormatEmitEvent, template: TemplateRef<void>) {
    this.targetNode = e.node;
    this.targetElement = e.event.target;
    this.dropdown = this.dropdownService.create(e.event, template);
  }
  optionHandle(e: any) {
    e.preventDefault();
    const id = e.target.dataset.id;
    if (id === '0') {
      this.treeNodes.editNode(this.targetElement, this.targetNode);
    } else {
      this.treeNodes.addNode(this.targetNode, this.types[Number(id)], (newNodes) => {
        this.nodes = [cloneDeep(newNodes)];
      });
    }
    this.dropdown.close();
  }
}
