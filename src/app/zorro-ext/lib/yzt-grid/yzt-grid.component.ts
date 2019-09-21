import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgZorroAntdModule, NzDropDownComponent } from 'ng-zorro-antd';
import { API } from '../services/api';
import { DirectivesModule } from '../share/directives/yzt-directives.modules';
import { YZTViewerDirectiveModule } from '../yzt-viewer/yzt-viewer.directive';
import { GridUtilService } from './share/grid-util.service';

declare let _; // 依赖lodash _.get，_.set

export interface PageData {
  data: Array<any>;
  numberOfElements: number;
  [portName: string]: any;
}

class GridIconIF {
  field: '';
  prop: '';
  iconTemplate: TemplateRef<any>;
}

export interface PageIndexAndSize {
  page: number;
  size: number;
}

@Component({
  selector: `yzt-grid`,
  templateUrl: `yzt-grid.component.html`,
  styleUrls: [`yzt-grid.component.scss`]
})
export class UIGridComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('gridImg', { read: ViewContainerRef }) gridImg: ViewContainerRef;
  @ViewChild('nzTable') nzTable: any;
  _scroll: { x: string; y: string } = { x: null, y: null };
  _data: PageData = { data: [], numberOfElements: 0 };
  _dataSet = [];
  _selections: any;
  _loading = false;
  @Input()
  set loading(v: boolean) {
    this._loading = !!v;
  }
  _fixScrollY: string | number;
  _title = '';
  _titleTpl: TemplateRef<any>;
  _footer = '';
  _footerTpl: TemplateRef<any>;
  _custom_popoverTpl: TemplateRef<any>;
  _exportLoading = false;
  _editCol = false;
  //用于存放可选列
  targetColumns: any[] = [];
  //备份完整columns
  editColumns: any[] = [];
  //grid表格按钮控制
  buttonGather = {
    showEditColumn: false,
    enableExport: false
  };
  exportDisable = false;

  @ViewChildren('searchDropdown') searchDropdown: QueryList<NzDropDownComponent>;

  set pageIndex(num) {
    if (this._page === num) {
      return;
    }
    this._page = num;
  }
  get pageIndex() {
    return this._page;
  }

  // 支持双向数据绑定
  @Input() set pageSize(num) {
    if (this._size === num) {
      return;
    }
    this._size = num;
  }
  get pageSize() {
    return this._size;
  }

  _page = 1;
  _size = 10;
  // 缓存上一次分页信息，控制避免多次请求接口
  private _pageIndex = 1;
  private _pageSize = 1;
  /**
   * 控制多选
   */
  _allChecked = false;
  _indeterminate = false;
  _displayData = [];
  // 自定义图片实例
  _iconComp = {};
  // 自定义单元格
  _customComp: { [k: string]: any } = {};
  // 表头搜索
  _searchCustom: { [k: string]: TemplateRef<any> } = {};
  _hasSearch: number;
  // 存储转换后的卡片字符串
  _popoverStr = '';
  _popoverArr = [];
  _showExtraPagination = true;

  set editCol(show: boolean) {
    if (show) {
      this.editColumns = [...this.columns, ...this.targetColumns];
    }
    this._editCol = show;
  }

  @Output() load: EventEmitter<PageIndexAndSize> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter();
  @Output() cellClick: EventEmitter<any> = new EventEmitter();
  @Output() cellOver: EventEmitter<any> = new EventEmitter();
  @Output() exportCSV: EventEmitter<any> = new EventEmitter();
  @Output() searchConfirm: EventEmitter<any> = new EventEmitter();

  @Input() id: string;
  @Input() columns = [];
  @Input() showSizeChanger = false; // 未知用途
  @Input() showPagination = false; // 是否显示分页
  @Input() pageSizeValues = [10, 30, 50, 100];
  @Input() showTitle = true;
  @Input() mulitipy = true; // 是否多选
  @Input() hideCheck = false; // 是否有全选选择框
  @Input() isSyncData = false;
  // 根据行状态更换行颜色，usage: {field: "status", normal: "normal"},
  // normal对应的值是数据中status的值
  @Input() colColor = {
    field: '', // 必填项
    normal: '',
    unnormal: '',
    // 时效预警
    prewarning: '',
    warning: '',
    timeOut: '',
    // 删除
    delete: ''
  };

  @Input()
  set scroll(value: { x: string; y: string }) {
    if (value) {
      this._scroll = value;
    } else {
      this._scroll = { x: null, y: null };
    }
    //   this.cdr.detectChanges();
  }

  @Input()
  set data(value: PageData) {
    this._loading = false;
    if (!value) {
      return;
    }
    // 手动调用查询，解决分页问题
    if (value.size) {
      this.pageSize = value.size;
      this.pageIndex = value.number + 1;
      this._pageIndex = this.pageIndex; // 控制查询的时候，引起的pageIndexChange事件造成走两次接口
      this._pageSize = this.pageSize; // 控制查询的时候，引起的pageSizeChange事件造成走两次接口
    }
    let data = value['data'] || [];
    // 优化性能。避免鼠标事件触发表格数据重复计算或者赋值
    for (let row of data) {
      const columns = [].concat(this.columns).concat(this.targetColumns);
      for (let c of columns) {
        let fieldValue = _.get(row, c.field, ''); // 兼容后端返回数据结构，eg:c.field="shipper.clientType"
        if (!c.field) {
          continue;
        }
        row[c.field] = fieldValue;
        let textLen = Number(c.textLength) ? c.textLength : 20;
        // 字段过长缩写
        if (fieldValue && fieldValue.length > textLen) {
          row[c.field + '_short_'] = this.replaceTextOmit(fieldValue, textLen, '');
        }
        // mergeName 数组合并
        if (c.popover) {
          row[c.field + '_popover_'] = this.replaceTextOmit(fieldValue, textLen, c.popover);
          // _.set(row, c.field + '_popover_arr_', this.splitName(fieldValue, c.popover));
        }
      }
    }
    this._displayData = value['data'] = data;
    this._data = value;

    // 隐藏表头搜索下拉框
    this.searchDropdown.forEach(item => {
      item.nzVisible = false;
    });
  }

  get data(): PageData {
    return this._data;
  }

  @Input()
  set fixScroll(height: any) {
    // tslint:disable-next-line:radix
    this._fixScrollY = `${parseInt(height)}px`;
  }

  // 设置头部
  @Input()
  set title(value: string | TemplateRef<void>) {
    if (value instanceof TemplateRef) {
      this._titleTpl = value;
    } else {
      this._title = value;
    }
  }
  //设置底部
  @Input()
  set footer(value: string | TemplateRef<void>) {
    if (value instanceof TemplateRef) {
      this._footerTpl = value;
    } else {
      this._footer = value;
    }
  }

  // 设置卡片
  @Input() set csPopover(value: TemplateRef<void>) {
    this._custom_popoverTpl = value;
  }

  // 表头搜索
  @Input()
  set searchTmpl(templs: any[]) {
    if (!templs || (templs && templs.length === 0)) {
      this._hasSearch = 0;
      return;
    }
    let prop;
    templs.forEach((templ, i) => {
      if (!templ) {
        return;
      }
      let references = Object.keys(templ._def.references)[0];
      if (!references) {
        return;
      }
      prop = references.split('_')[1].toString();
      Object.defineProperty(this._searchCustom, prop, {
        value: templ,
        writable: false
      });
    });
    // console.log(this._searchCustom)
    this._hasSearch = 1;
  }

  @Input()
  set selection(value: Array<any>) {
    // 单选接受一个对象多选接受数组
    if (!this.util.isEqual(this._selections, value)) {
      if (!value.length) {
        this._displayData.forEach(data => {
          data.checked = false;
        });
        this._indeterminate = false;
        this._allChecked = false;
      }
      this._selections = value;
      this.selectionChange.emit(value);
    }
  }

  @Input()
  set showExtraPagination(isShow: boolean) {
    if (isShow) {
      this._showExtraPagination = true;
      this.showPagination = false;
    } else {
      this._showExtraPagination = false;
      this.showPagination = false;
    }
  }

  constructor(private util: GridUtilService, public _vcr: ViewContainerRef, public api: API) {}

  ngOnInit() {
    if (this.id) {
      let columnsMap = localStorage[this.id];
      if (columnsMap) {
        columnsMap = JSON.parse(columnsMap);
        let sourceColumns = columnsMap['sourceColumns'];
        let targetColumns = columnsMap['targetColumns'];
        if (
          sourceColumns &&
          targetColumns &&
          this.util.generateColumnKey([...sourceColumns, ...targetColumns]) ===
            this.util.generateColumnKey(this.columns)
        ) {
          this.columns = sourceColumns;
          this.targetColumns = targetColumns;
        }
      }
    }
    this.editColumns = this.columns;
    this.editColumns.forEach((column, i) => {
      Object.defineProperties(column, {
        title: { value: column.header },
        disabled: { value: column.transferVisabled || false }
      });
    });
  }

  ngAfterViewInit() {
    // if (!this.isSyncData) {
    setTimeout(() => {
      this.onLazyLoad();
      this.resetScrollYHeight();
    });
    // }
  }

  ngOnDestroy() {
    if (this.id) {
      localStorage[this.id] = JSON.stringify({
        sourceColumns: this.columns,
        targetColumns: this.targetColumns
      });
    }
  }

  /**page index change event handler */
  nzPageIndexChange($event) {
    setTimeout(() => {
      if (this._pageIndex === $event) {
        return;
      }
      this.onLazyLoad();
      this._pageIndex = $event;
    });
  }

  pageSizeChange($event) {
    // 控制size改变，引起pageIndex变化而产生多次请求
    if (this._pageIndex !== this.pageIndex) {
      return;
    }
    setTimeout(() => {
      if (this._pageSize === $event) {
        return;
      }
      this.onLazyLoad();
    });
  }

  isNeedSearch(column: any) {
    for (let value in column) {
      if (column[value] && column[value].indexOf('search_') !== -1) {
        return column[value].split('_')[1];
      }
    }
    return 0;
  }

  editChange(change: any) {
    let originChange = change,
      items = originChange.list;

    items.forEach((item, index) => {
      if (change.from === 'left') {
        this.editColumns.forEach(column => {
          if (item['field'] === column['field'] && column.direction !== 'right') {
            column.direction = 'right';
          }
        });
      } else {
        this.targetColumns.forEach(column => {
          if (item['field'] === column['field'] && column.direction === 'right') {
            column.direction = 'left';
          }
        });
      }
    });

    this.columns = this.editColumns.filter(column => column.direction !== 'right');
    this.targetColumns = this.editColumns.filter(column => column.direction === 'right');
    // 重新赋值，保证穿梭框排序保持最新一次
    this.editColumns = [...this.columns, ...this.targetColumns];
  }

  onLazyLoad(page: PageIndexAndSize = { page: this.pageIndex, size: this.pageSize }): any {
    if (!this.isSyncData) {
      this._loading = true;
    }
    this.load.emit(page);
  }

  getIconInstance({ outField, outProp, iconTemplate }) {
    this._iconComp[outField] = {
      outField: outField || '',
      outProp: outProp || '',
      iconTemplate: iconTemplate || ''
    };
  }

  getCusTmplInstance({ outField, customTemplate }) {
    this._customComp[outField] = {
      outField: outField || '',
      customTemplate: customTemplate || ''
    };
  }

  /**
   * 记录选择事件
   * @param rows
   */
  onRowSelectChange(data: any, index, pageData) {
    if (this.mulitipy) {
      pageData.map(item => {
        item.checked = false;
      });
      data.checked = !data.checked;
    } else {
      for (let i = 0; i < pageData.length; ++i) {
        if (i === index && data.checked) {
          return;
        }
      }
      data.checked = !data.checked;
    }

    this.mulitipy ? this.refreshStatus() : this.refreshSingleStatus(null, this._data.data, index);

    return false;
  }

  /**
   * 选择checkbox
   */
  refreshStatus(event?: MouseEvent) {
    const selections = this._displayData.filter(value => value.checked === true);
    const allChecked = this._displayData.every(value => value.checked === true);
    const allUnChecked = this._displayData.every(value => !value.checked);
    this._allChecked = allChecked;
    this._indeterminate = !allChecked && !allUnChecked;
    this.selection = selections;
    this.selectionChange.emit(selections);
  }

  refreshSingleStatus(event: MouseEvent, data, index: number) {
    /*  if (event) {
         event.stopPropagation();
     } */
    data.forEach((val, i) => {
      if (index === i) {
        return;
      }
      val.checked = false;
    });
    this.selection = data.filter(v => v.checked);
  }

  /**
   * 全选和反选
   * @param value
   * @param data
   */
  checkAll(value, data: Array<any>) {
    if (value) {
      this._displayData.forEach(data1 => {
        data1.checked = true;
      });
    } else {
      this._displayData.forEach(data2 => {
        data2.checked = false;
      });
    }
    this.refreshStatus();
  }

  /**
   * cell点击事件
   * @param event
   * @param row
   * @param field
   */
  onCellClick(event: Event, row: any, field: any) {
    event.stopPropagation();
    let value = row[field];
    this.cellClick.emit({
      row: row,
      field: field,
      value: value,
      originalEvent: event
    });
  }

  /**
   * 鼠标mouseenter事件
   */
  onCellMouseEnter(event: any, row: any, field: any) {
    event.stopPropagation();
    // let value = this.value(row, field);
    let value = row[field];
    this.cellOver.emit({
      row: row,
      field: field,
      value: value,
      originalEvent: event
    });
  }

  /**
   * 数据转为字符串
   * @param val
   * @returns {any}
   * @constructor
   */
  dataToStr(val: any) {
    let resultData;
    if (typeof val === 'number') {
      resultData = val.toString();
    } else if (typeof val === 'undefined') {
      resultData = '';
    } else if (val == null) {
      resultData = '';
    } else if (typeof val === 'object') {
      resultData = JSON.stringify(val);
    } else if (typeof val === 'boolean') {
      resultData = val ? '是' : '否';
    } else {
      resultData = val;
    }
    return resultData;
  }

  /**
   * 对有textLength属性的column进行字节数量控制
   * @param val
   * @param textLength
   * @param mergeName 控制popover弹窗,传需要合并的key,eg: [{a: '床'},{a: '被子'}] ,此处mergeName传'a'
   * @returns {string|void|any}
   */
  replaceTextOmit(val: any, textLength: number = 20, mergeName = '') {
    let resultData, temp;
    resultData = this.dataToStr(val);
    if (Object.prototype.toString.call(val) === '[object Array]') {
      let namesArr = _.map(val, mergeName),
        namesStr = namesArr.join(',');
      temp = namesStr.slice(0, textLength);
      return namesStr.length > textLength ? `${temp}...` : namesStr;
    }

    if (typeof resultData === 'string') {
      temp = resultData.slice(0, textLength);
      return resultData.length > textLength ? `${temp}...` : resultData;
    } else {
      return resultData;
    }
  }

  /**
   * 字符串转数组，逗号隔开, popover在表格中有性能问题，
   * 会触发两次导致第一次会显示表格中最后一个单元格的值再显示想显示的popover数组
   * 临时解决办法必须在html模板中传val值，估计是多次触发表格的变化检测
   */
  splitName(val, mergeName = '') {
    let result;
    if (Object.prototype.toString.call(val) === '[object Array]') {
      let namesArr = _.map(val, mergeName),
        namesStr = namesArr.join(',');
      result = namesStr;
    } else if (typeof val === 'string') {
      result = val;
    }
    let reg = /[,，]/g;
    result = result.replace(reg, ',');
    return _.compact(result.split(',')) || [];
  }

  /**
   *
   * @param grid
   * @param data
   * @param isFailed 失败了
   */
  doExportCSV(grid, data, isFailed?: boolean) {
    grid.exportDisable = false;
    if (isFailed) {
      return;
    }
    let columns = grid.columns;
    let csv = '\ufeff';
    //headers
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].field && !columns[i].hidden) {
        csv += '"' + (columns[i].header || columns[i].field) + '"';
        if (i < columns.length - 1) {
          csv += ',';
        }
      }
    }
    //body
    data.forEach(function(record, i) {
      csv += '\n';
      for (let i_1 = 0; i_1 < columns.length; i_1++) {
        if (columns[i_1].field && !columns[i_1].hidden) {
          let value = Object.defineProperty(record, columns[i_1].field, null);
          if (typeof value === 'string') {
            value = value.replace('"', '""');
          } else if (value === null || value === 'null' || value === 'undefined') {
            value = '';
          }
          if (!isNaN(Number(value)) && value.length > 12) {
            csv += '"' + value + '\ufeff"';
          } else {
            csv += '"' + value + '"';
          }
          if (i_1 < columns.length - 1) {
            csv += ',';
          }
        }
      }
    });
    let blob = new Blob([csv], {
      type: 'text/csv;charset=utf-8;'
    });
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveOrOpenBlob(blob, '导出.csv');
    } else {
      let link = document.createElement('a');
      link.style.display = 'none';
      document.body.appendChild(link);
      if (link.download !== undefined) {
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', '导出.csv');
        link.click();
      } else {
        csv = 'data:text/csv;charset=utf-8,' + csv;
        window.open(encodeURI(csv));
      }
      document.body.removeChild(link);
    }
  }

  exportCSVIntenal() {
    let $this = this;
    this.exportDisable = true;
    this.exportCSV.emit({
      done: $this.doExportCSV,
      grid: $this
    });
  }

  /**
   * 根据状态判断行颜色，配合colColor属性
   * @param status 对应数据属性
   */
  getColColor(status) {
    if (!this.colColor.field) {
      return;
    }
    switch (status) {
      case this.colColor.normal:
        return '#000000a6';
      case this.colColor.delete:
        return '#f04134';
      // case this.colColor.prewarning:
      //     return "origin";
      // case this.colColor.warning:
      //     return "green";
      // case this.colColor.timeOut:
      //     return "#000";
      default:
        return '#000000a6';
    }
  }

  resetScrollYHeight(): void {
    if (this._showExtraPagination) {
      const ctn = document.querySelector('.content-container');
      const qry_area = document.querySelector('.content-header');
      this._scroll.y = `${ctn.clientHeight - qry_area.clientHeight - 100}px`;
    }
  }
}

@NgModule({
  imports: [CommonModule, FormsModule, NgZorroAntdModule, DirectivesModule, YZTViewerDirectiveModule],
  declarations: [UIGridComponent],
  providers: [GridUtilService],
  exports: [UIGridComponent]
})
export class UIGridModule {}
