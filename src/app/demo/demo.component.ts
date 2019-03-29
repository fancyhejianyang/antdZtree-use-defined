import {
  Component,
  OnInit,
  ViewChild,
  Renderer2,
  TemplateRef
} from '@angular/core';
import {
  NzFormatEmitEvent,
  NzTreeNodeOptions,
  NzTreeNode,
  NzTreeComponent,
  NzDropdownService,
  NzDropdownContextComponent,
  NzMessageService,
  NzModalRef,
  NzModalService
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
  nodes: NzTreeNodeOptions[] = [
    {
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
    }
  ];
  nodeShow = false;
  leafShow = false;
  currentId;
  nodeId;
  leafId;
  leafTitle;
  nodeTitle;
  private dropdown: NzDropdownContextComponent;
  treeNodes: TreeNode;
  targetNode: NzTreeNode;
  targetElement: Element;
  types = ['node', 'leaf', 'delete'];
  constructor(
    private render2: Renderer2,
    private message: NzMessageService,
    private modalService: NzModalService,
    private dropdownService: NzDropdownService
  ) {}

  ngOnInit() {
    this.treeNodes = new TreeNode(this.nodes, this.message);
  }
  nzClick(e: NzFormatEmitEvent) {
    e.event.preventDefault();
    this.closeDropdown();
  }
  nzCheck(e: NzFormatEmitEvent) {
    console.log(e);
  }
  nzSelect(keys: string[]): void {
    console.log(keys, this.treeCom.getSelectedNodeList());
  }
  // dbClick(e: NzFormatEmitEvent) {
  //   console.log(e);
  //   this.treeNodes.editNode(e.event.srcElement, e.node);
  // }
  contentMenu(e: NzFormatEmitEvent, template: TemplateRef<void>) {
    this.targetNode = e.node;
    this.targetElement = e.event.srcElement;
    this.closeDropdown();
    if (this.targetElement.nodeName === 'SPAN') {
      this.dropdown = this.dropdownService.create(e.event, template);
    }
  }
  optionHandle(e: any) {
    e.preventDefault();
    this.currentId = e.target.dataset.id;
    if (this.currentId === '3') {
      this.dropdown.close();
      this.modalService.confirm({
        nzTitle: '提示',
        nzContent: '确认执行删除该选项？',
        nzOnOk: () => {
          this.treeNodes.deleteNode(this.targetElement, this.targetNode);
        }
      });
    } else if (this.currentId === '1') {
      this.dropdown.close();
      this.nodeShow = true;
    } else {
      this.dropdown.close();
      this.leafShow = true;
    }
  }
  nodeHandleCancel() {
    this.nodeShow = false;
  }
  leafHandleCancel() {
    this.leafShow = false;
  }
  nodeHandleOk() {
    if (!this.nodeId || !this.nodeTitle) {
      this.message.create('warning', '请填写完整信息！');
      return;
    }
    this.nodeShow = false;
    // 后端执行添加api写在这里
    this.treeNodes.addNode(
      this.targetNode,
      this.types[Number(this.currentId)],
      newNodes => {
        this.nodes = [cloneDeep(newNodes)];
      }
    );
  }
  leafHandleOk() {
    if (!this.leafId || !this.leafTitle) {
      this.message.create('warning', '请填写完整信息！');
      return;
    }
    this.nodeShow = false;
    this.treeNodes.addNode(
      this.targetNode,
      this.types[Number(this.currentId)],
      newNodes => {
        this.nodes = [cloneDeep(newNodes)];
      }
    );
  }
  closeDropdown() {
    if (this.dropdown) {
      this.dropdown.close();
    }
  }
}
