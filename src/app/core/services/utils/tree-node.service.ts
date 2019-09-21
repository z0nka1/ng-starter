/**
 * @author: giscafer
 * @date: 2018-04-26 14:07:55
 * @description: 树形数据处理工具方法
 */
/*tslint:disable*/

import { Injectable } from '@angular/core';

@Injectable()
export class TreeNodeService {

  constructor() {
  }

  /**
   * 向上查找父级
   * @param selections 选择的对象数组
   * @param node 当前节点
   * @param select 选择状态
   * @param parentField 可选,自定义parent Field
   * @param codeField 可选,自定义code field
   * @returns {Array}
   */
  partialSelected(data: Array<any>, codes: Array<string | number> = [], parentField: string = 'parentCode', codeField: string = 'code') {
    let prevNodes, prevParent, result = [];

    const initFn = (nodes, parent) => {
      for (let node of nodes) {
        node.parent = parent;
        if (codes.includes(node[codeField])) {
          // 父级处理，使得可以回显正确（这里将父级也选进去了，保存的时候，去掉非全选 partialSelected = true 的父级）
          if (!codes.includes(node[parentField]) && node[parentField] && node[parentField] !== '000000000000') {
            codes.push(node[parentField]);
            if (prevParent && !this.isSelected(result, prevParent)) {
              result.push(prevParent);
            }
            if (node.parent && !this.isSelected(result, node.parent)) {
              result.push(node.parent);
              // 回显处理部分选择效果
              this.propagateUp(result, node.parent, true);
            }
          }
          result.push(node);
          // 回显处理部分选择效果
          this.propagateUp(result, node, true);
        }

        if (node.children && node.children.length) {
          prevNodes = nodes;
          prevParent = parent;
          initFn(node.children, node);
        }
      }

    }
    initFn(data, null);

    return result;
  }

  /**
   * 向上查找父级
   * @param selections 选择的对象数组
   * @param node 当前节点
   * @param select 选择状态
   */
  propagateUp(selections: any[], node: any, select: boolean) {
    if (node.children && node.children.length) {
      let selectedCount: number = 0;
      let childPartialSelected: boolean = false;
      for (let child of node.children) {
        if (this.isSelected(selections, child)) {
          selectedCount++;
        }
        else if (child.partialSelected) {
          childPartialSelected = true;
        }
      }

      if (select && selectedCount == node.children.length) {
        selections = [...selections || [], node];
        node.partialSelected = false;
      }
      else {
        if (!select) {
          let index = this.findIndexInSelection(selections, node);
          if (index >= 0) {
            selections = selections.filter((val, i) => i != index);
          }
        }

        if (childPartialSelected || selectedCount > 0 && selectedCount != node.children.length)
          node.partialSelected = true;
        else
          node.partialSelected = false;
      }
    }

    let parent = node.parent;
    if (parent) {
      this.propagateUp(selections, parent, select);
    }
  }

  /**
   * 向下查找
   * @param selections 选择的对象数组
   * @param node 当前节点
   * @param select 选择状态
   */
  propagateDown(selections: any[], node: any, select: boolean) {
    let index = this.findIndexInSelection(selections, node);

    if (select && index == -1) {
      selections = [...selections || [], node];
    }
    else if (!select && index > -1) {
      selections = selections.filter((val, i) => i != index);
    }

    node.partialSelected = false;

    if (node.children && node.children.length) {
      for (let child of node.children) {
        this.propagateDown(selections, child, select);
      }
    }
  }

  isSelected(selections, node: any) {
    return this.findIndexInSelection(selections, node) != -1;
  }

  findIndexInSelection(selections, node: any) {
    let index: number = -1;

    for (let i = 0; i < selections.length; i++) {
      if (selections[i] == node) {
        index = i;
        break;
      }
    }

    return index;
  }

  findParentNode(data: Array<any>, node: any) {
    let code = node['code'], parentNode = null;
    const initFn = (nodes, parent) => {
      for (let node of nodes) {
        if (node['code'] === code) {
          parentNode = parent;
          break;
        }
        if (node.children && node.children.length) {
          initFn(node.children, node);
        }
      }
    }
    initFn(data, null);
    return parentNode;
  }

}
