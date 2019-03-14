import { NzTreeNodeOptions, NzTreeNode, NzMessageService } from 'ng-zorro-antd';
export class TreeNode {
  nodes: NzTreeNodeOptions[];
  node: NzTreeNodeOptions;
  regStr: RegExp = /[!@#$%^&*()+|\/<>?:"{}，。、；‘【】\]\[]/gi;
  pane: Element;
  types = ['', 'node', 'leaf'];
  // ref = new ElementRef('span');
  removePane: () => void;
  existNodeTitleIndex: number;
  message: NzMessageService;
  // 添加的节点是否重复
  constructor(nodes, message) {
    this.nodes = nodes;
    this.message = message;
  }
  addNode(pNode: NzTreeNode, type, callback: any) {
    // 设置添加默认模板
    this.setNode(type, pNode);
    // leaf 节点需要转移到上层node节点
    if (pNode.origin.isLeaf) {
      pNode.parentNode.origin.children = [...pNode.parentNode.origin.children, this.node];
    } else {
      pNode.origin.children = [...pNode.origin.children, this.node];
    }
    this.getRootNode(pNode);
    callback(this.nodes);
  }
  editNode(element: any, pNode: NzTreeNode) {
    // 右击区域为LI标签时候要将元素定位到具体的span 往下2层
    if (element.nodeName !== 'SPAN') {
      // element = element.children[2].children[0];
      return;
    }
    let pastText;
    element.addEventListener('focus', (e) => {
      pastText = element.innerText;
    });
    element.addEventListener('blur', (e) => {
      if (e.target.innerText.trim() === '' || this.regStr.test(e.target.innerText.trim())) {
        this.message.create('warning', '修改值不可包含特殊字符或者为空值！');
        e.target.innerText = pastText;
        return;
      }
      e.target.innerText = e.target.innerText.trim().replace('<br/>', '');
      e.target.removeAttribute('contentEditable');
      // 获取value 并更新data
      pNode.origin.title = e.target.innerText;
    });
    element.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        e.preventDefault();
        element.blur();
      }
    });
    // 设置可编辑属性
    // this.removePane = callback;
    element.setAttribute('contentEditable', 'true');
    element.focus();
  }
  private getRootNode(node: NzTreeNode) {
    if (node.parentNode === null) {
      this.nodes = node.origin;
    } else {
      this.getRootNode(node.parentNode);
    }
  }
  private setNode(type: string, pNode: NzTreeNode) {
    this.checkNodeKey(type, pNode);
    // 同级node中是否有已经添加的默认节点 index 自增
    const index = this.existNodeTitleIndex ? this.existNodeTitleIndex + 1 : 1;
    if (type === 'node') {
      this.node = {
        title: `parent${index}`,
        key: `parentKey${index}`,
        isLeaf: false,
        children: []
      };
    } else {
      this.node = {
        title: `leaf${index}`,
        key: `leafKey${index}`,
        isLeaf: true
      };
    }
  }
  private checkNodeKey(type, node) {
    this.existNodeTitleIndex = null;
    let arrayLike = [];
    if (node.origin.isLeaf) {
      arrayLike = node.parentNode.origin.children;
    } else {
      arrayLike = node.origin.children;
    }
    let nums = [];
    // arrayLike = arrayLike.filter(()=>)
    arrayLike.forEach((element, index) => {
      const regStr = type === 'node' ? 'parent' : 'leaf';
      if (element.title.includes(regStr)) {
        const title = element.title;
        const startI = title.indexOf(regStr);
        const endI = type === 'node' ? startI + 6 : startI + 4;
        if (title.slice(endI) && Number(title.slice(endI))) {
          nums = [...nums, Number(title.slice(endI))];
        }
      }
    });
    this.existNodeTitleIndex = nums.length > 0 ? Math.max(...nums) : null;
  }
}
