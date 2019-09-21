/**
 * @Description: 用于展示当前查询条件
 * @Author: zomixi
 * @Date: 2019-05-15 14:42:17
 */

import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Pipe,
  PipeTransform,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';

export interface QueryTab {
  label: string;
  value: any;
  key?: string;
  lexicon?: { [key: string]: string }; // 词典
  defaultValue?: any; // 默认值
}

@Pipe({
  name: 'queryTabsMapPipe'
})
export class QueryTabsMapPipe implements PipeTransform {
  transform(queryTabsMap: { [key: string]: QueryTab }, exceptRule: (value: any) => boolean): QueryTab[] {
    if (!queryTabsMap) {
      return [];
    }

    const queryTabs = [];

    for (const key in queryTabsMap) {
      if (queryTabsMap.hasOwnProperty(key)) {
        const element = queryTabsMap[key];
        element.key = key;
        if (element.hasOwnProperty('defaultValue')) {
          // 按默认值处理
          if (element.value !== element.defaultValue) {
            queryTabs.push(element);
          }
        } else {
          // 按过滤规则处理
          if (!exceptRule(element.value)) {
            queryTabs.push(element);
          }
        }
      }
    }

    return queryTabs;
  }
}

@Component({
  selector: 'query-tabs',
  templateUrl: './query-tabs.component.html',
  styleUrls: ['./query-tabs.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QueryTabsComponent implements OnInit, OnChanges {
  @Input() queryTabsMap: { [key: string]: QueryTab } = {}; // map对象，通过pipe转成数组显示
  @Input() lexicon: { [key: string]: string } = null; // 词典
  @Input() exceptRule: (value: any) => boolean; // 排除规则 return true表示排除

  @Output() queryTabsMapChange: EventEmitter<any> = new EventEmitter();
  @Output() queryChange: EventEmitter<any> = new EventEmitter();
  @Output() queryTabClose: EventEmitter<any> = new EventEmitter();

  constructor() {
    // 默认排除null undefined '' []
    this.exceptRule = value => {
      // 基本数据类型
      if (typeof value !== 'object') {
        return [undefined, ''].includes(value);
      }
      // 数组
      if (Array.isArray(value) && !value.length) {
        return true;
      }
      if (value === null) {
        return true;
      }
    };
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.queryTabsMap) {
      this.updateQuery();
    }
  }

  closeTab(closedTab): void {
    // 有默认值恢复默认值，没有则置为null
    closedTab.value = closedTab.hasOwnProperty('defaultValue') ? closedTab.defaultValue : null;
    this.queryTabClose.emit(closedTab);

    this.queryTabsMap = { ...this.queryTabsMap };
    this.queryTabsMapChange.emit(this.queryTabsMap);
  }

  // 组件内更新查询值
  updateQuery() {
    const query = {};
    for (const key in this.queryTabsMap) {
      if (this.queryTabsMap.hasOwnProperty(key)) {
        const element = this.queryTabsMap[key];
        query[key] = element.value;
      }
    }
    this.queryChange.emit(query);
  }
}
