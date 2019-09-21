/* tslint:disable */

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  Renderer2,
  TemplateRef
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ApiService } from '@zorro-ext/lib/services/api.service';
import { tagAnimation } from './tag-animations';

@Component({
  selector: 'area-multiple',
  templateUrl: './area-multiple.component.html',
  animations: [tagAnimation],
  styleUrls: ['./area-multiple.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaMultipleSelectComponent),
      multi: true
    }
  ]
})
export class AreaMultipleSelectComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  @Input() selection: any[] = [];
  _label = '';
  _width = '190px';

  /**
   * 控制选择框是否显示
   */
  showBox = true;
  documentClickListener: any;
  //省市区数据
  provinceData: any[] = [];
  cityData: any[] = [];
  districtData: any[] = [];

  checkedProArr: any[] = [];
  checkedCityArr: any = [];
  checkedDistrictArr: any = [];
  //用于回显不能编辑
  disabledProArr: any[] = [];
  disabledCityArr: any = [];
  disabledDistrictArr: any = [];

  totalTree: any[] = [];
  _placeholder = '请选择';

  private _value: string;
  private onChangeCallback: (_: any) => void = () => {};
  private onTouchedCallback: () => void = () => {};

  @Output()
  onChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() set placeholder(v) {
    if (v) {
      this._placeholder = v;
      this._label = '';
    }
  }

  @Input() set width(v) {
    const width = parseInt(v, 0);
    this._width = Array.from(v).includes('%') ? `${v}%` : isNaN(width) ? this._width : `${width}px`;
  }
  @Input() height = '400px';

  @ContentChild('render') render: TemplateRef<void>;

  constructor(public api: ApiService, public rd: Renderer2, public cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.echoSelet();
    this.getData('provinceData', { id: '' });
  }

  // 写入值
  writeValue(value: any) {
    if (value !== this._value) {
      this._value = value;
    }
  }

  set value(value: any) {
    if (value !== this._value) {
      this._value = value;
      this.onChangeCallback(value);
    }
  }
  get value(): any {
    return this._value;
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  /**
   * 隐藏弹窗
   */
  hide() {
    this.showBox = true;
  }

  ngAfterViewInit() {
    this.documentClickListener = this.rd.listen('body', 'click', () => {
      this.hide();
    });
  }
  echoSelet() {
    this.checkedProArr = _.map(this.selection, 'provinceId');
    this.checkedCityArr = [
      ..._.map(this.selection, 'cityId'),
      ..._.map(_.reject(this.selection, ['cityId', 0]), 'selectId')
    ];
    this.checkedDistrictArr = [
      ..._.map(this.selection, 'districtId'),
      ..._.map(_.reject(this.selection, ['districtId', 0]), 'selectId')
    ];
  }
  selectPro(pro, label, $event) {
    $event.stopPropagation();
    if (!pro || !pro.click || $event.target.tagName === 'I') return;
    this.districtData = [];
    this.cityData = [];
    if (pro.name === '全国') {
      return;
    }
    this.getData('cityData', pro);

    let proIdArr = _.map(this.totalTree, 'id') || [];
    proIdArr.includes(pro.id) ? null : this.totalTree.push(pro);
  }

  checkedPro(pro, label, $event) {
    $event.stopPropagation();
    this.districtData = [];
    this.cityData = [];
    if (label.checked) {
      pro.click = true;
      if (pro.children.length) {
        pro.children = [];
      }
      this.checkedProArr.push(pro.id);
      this.totalTree.push(pro);
      this.districtData = [];
      if (pro.name === '全国') {
        this.handleResult();
        return;
      }
      this.getData('cityData', pro);
    } else {
      // 清除 cheked
      this.totalTree.forEach(p => {
        if (p.id === pro.id) {
          if (p.children.length) {
            p.children.forEach(c => {
              if (c.children.length) {
                c.children.forEach(d => {
                  if (this.checkedDistrictArr.includes(d.id)) {
                    this.checkedDistrictArr.splice(this.checkedDistrictArr.indexOf(d.id), 1);
                  }
                });
              }
              if (this.checkedCityArr.includes(c.id)) {
                this.checkedCityArr.splice(this.checkedCityArr.indexOf(c.id), 1);
              }
            });
          }
        }
      });
      this.checkedProArr.splice(this.checkedProArr.indexOf(pro.id), 1);
      this.deleteSelect(this.totalTree, pro);
      if (pro.click) {
        this.cityData = [];
        this.districtData = [];
      }
      pro.click = false;

      this.selection = this.selection.filter(item => {
        if (item.provinceId === pro.id) {
          this.checkedCityArr.splice(this.checkedCityArr.indexOf(item.cityId), 1);
          this.checkedDistrictArr.splice(this.checkedDistrictArr.indexOf(item.districtId), 1);
          return false;
        }
        return true;
      });
    }
    this.handleResult();
  }
  selectCity(city, label, $event) {
    $event.stopPropagation();
    //点击文字如果没选中直接return
    if (!city || !city.click || $event.target.tagName === 'I') return;
    this.districtData = [];
    if (city.name === '全市') {
      return;
    }
    this.getData('districtData', city);
    //遍历省 添加市
    this.totalTree.forEach(p => {
      if (p.id === city.parentId) {
        let cityIdArr = _.map(p.children, 'id') || [];
        cityIdArr.includes(city.id) ? null : p.children.push(city);
      }
    });
  }

  checkedCity(city, label, $event) {
    $event.stopPropagation();
    this.districtData = [];
    //选中
    if (label.checked) {
      city.click = true;
      //如果有区 就情空
      if (city.children.length) {
        city.children = [];
      }
      this.checkedCityArr.push(city.id);
      //遍历省 添加市
      this.totalTree.forEach(p => {
        if (p.id === city.parentId) {
          p.children.push(city);
        }
      });
      if (city.name === '全市') {
        this.handleResult();
        return;
      }
      this.getData('districtData', city);
      //取消选中
    } else {
      //清除选择记录
      this.checkedCityArr = this.checkedCityArr.filter(v => v !== city.id);
      //清除市
      this.totalTree.forEach(p => {
        if (p.id === city.parentId) {
          if (p.children.length) {
            p.children.forEach((c, i) => {
              //遍历删除区checked
              if (c.id === city.id) {
                c.children.forEach(d => {
                  if (this.checkedDistrictArr.includes(d.id)) {
                    this.checkedDistrictArr.splice(this.checkedDistrictArr.indexOf(d.id), 1);
                  }
                });
                //删除市数据
                p.children.splice(i, 1);
                if (!p.children.length) {
                  // this.cityData = [];
                }
              }
            });
          }
        }
      });
      if (city.click) {
        // this.districtData = [];
      }
      city.click = false;

      this.selection = this.selection.filter(item => {
        if (item.cityId === city.id || item.selectId === city.id) {
          //item.selectId === city.id 全市
          this.checkedDistrictArr.splice(this.checkedDistrictArr.indexOf(item.districtId), 1);
          return false;
        }
        return true;
      });
    }
    this.handleResult();
  }
  selectDistrict(district, label, $event) {
    $event.stopPropagation();
    //点击文字如果没选中直接return
    if (!district || !district.click) return;
  }
  /**
   * 点击区多选框
   */
  checkedDistrict(district, label, $event) {
    $event.stopPropagation();
    //选中
    if (label.checked) {
      district.click = true;
      this.checkedDistrictArr.push(district.id);
      this.totalTree.forEach(v => {
        v.children.forEach(c => {
          if (c.id === district.parentId) {
            c.children.push(district);
          }
        });
      });
    } else {
      district.click = false;
      this.checkedDistrictArr = this.checkedDistrictArr.filter(v => v !== district.id);
      this.totalTree.forEach(p => {
        if (p.children.length) {
          p.children.forEach(c => {
            if (c.id === district.parentId) {
              c.children = c.children.filter(d => d.id !== district.id);
              if (!c.children.length && c.click) {
                // this.districtData = [];
              }
            }
          });
        }
      });
      //item.selectId === district.id 全区
      this.selection = this.selection.filter(item => {
        if (item.districtId === district.id || item.selectId === district.id) {
          return false;
        }
        return true;
      });
    }
    this.handleResult();
  }
  clearClick(type) {
    this[type].forEach(v => {
      v.click = false;
    });
  }

  /**
   * 获取省市区的数据
   */
  getData(type, pro) {
    let cacheArea = this.getCache(pro.id);
    if (cacheArea.length) {
      cacheArea.forEach(v => {
        v.children = [];
      });
      this.setChecked(type, cacheArea);
      this.setParent(cacheArea, type === 'province' ? { id: -1 } : pro);
      this[type] = cacheArea;
      return;
    }
    this.api.findAreaList({ parentId: pro.id }).subscribe(json => {
      let result = [];
      let data = [...(json && json.data)];
      data.forEach(d => {
        d.areaId = d.id;
        d.children = [];
      });
      if (type === 'cityData') {
        result.push({
          id: pro.id,
          level: 0,
          name: '全市',
          areaId: 0
        });
      }
      if (type === 'districtData') {
        result.push({
          id: pro.id,
          level: 1,
          name: '全区',
          areaId: 0
        });
      }
      result = [...result, ...data];
      this.setParent(result, type === 'provinceData' ? { id: -1 } : pro);
      this.setCache(pro.id, result);
      this.setChecked(type, result);
      this[type] = result;
    });
  }

  panelClick($event) {
    $event.stopPropagation();
  }

  setChecked(type, data) {
    let checkedProArr = [...this.disabledProArr, ...this.checkedProArr];
    let checkedCityArr = [...this.disabledCityArr, ...this.checkedCityArr];
    let checkedDistrictArr = [...this.disabledDistrictArr, ...this.checkedDistrictArr];
    let arr: any[] = [];
    type === 'cityData'
      ? (arr = checkedCityArr)
      : type === 'districtData'
      ? (arr = checkedDistrictArr)
      : (arr = checkedProArr);
    data.forEach(v => {
      v.click = false;
      if (arr.indexOf(v.id) !== -1) {
        v.click = true;
      }
    });
  }

  /**
   * 给省市区数据打上标记
   * @param {any[]} data
   * @param obj
   */
  setParent(data = [], obj) {
    data.forEach(item => {
      item.parentId = obj.id;
      item.parentName = obj.name;
      item.children = [];
    });
  }

  /**
   * 删除选中的数据 & 移除子区域
   * @param {Array} data 当前区域
   * @param obj 当前选中
   */
  deleteSelect(data = [], obj) {
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === obj.id) {
        data.splice(i, 1);
      }
    }
  }

  clear() {
    this._label = '';
    this.totalTree.forEach(p => {
      p.click = false;
    });
    this.cityData = [];
    this.districtData = [];
    this.checkedProArr = [];
    this.checkedCityArr = [];
    this.checkedDistrictArr = [];
    this.selection = [];
    this.totalTree = [];
    this.handleResult();
  }

  /**
   * 处理totaltree
   */
  handleResult(type?) {
    let result = [];
    this._label = '';
    for (let t of this.totalTree) {
      let name = t.name;
      let obj = {
        province: name,
        provinceId: t.id,
        city: '全市',
        cityId: '0',
        district: '全区',
        districtId: '0',
        parentId: '0',
        selectId: t.id,
        areaId: t.areaId
      };
      type === 'echo' ? this.checkedProArr.push(t.id) : null;
      let children = t.children;
      if (children.length) {
        for (let c of children) {
          type === 'echo' ? this.checkedCityArr.push(c.id) : null;
          let children2 = c.children;
          let cityObj = {
            province: name,
            provinceId: t.id,
            city: c.name,
            cityId: c.id,
            district: '全区',
            districtId: '0',
            parentId: c.parentId,
            areaId: c.areaId,
            selectId: c.id
          };
          // 选中了district
          if (children2.length) {
            for (let d of children2) {
              type === 'echo' ? this.checkedDistrictArr.push(d.id) : null;
              let districtObj = {
                province: name,
                provinceId: t.id,
                city: cityObj['city'],
                district: d.name,
                parentId: d.parentId,
                cityId: c.id,
                districtId: d.id,
                selectId: d.id,
                areaId: d.areaId
              };
              result.push(districtObj);
            }
          } else {
            result.push(cityObj);
          }
        }
      } else {
        result.push(obj);
      }
    }
    // 除去已取消的
    let chenkArr = [...this.checkedProArr, ...this.checkedCityArr, ...this.checkedDistrictArr];
    let seletedId = [];
    this.selection = this.selection.filter(item => {
      if (_.uniq(chenkArr).includes(item.selectId)) {
        seletedId = [_.get(item, 'provinceId'), _.get(item, 'cityId'), _.get(item, 'districtId'), ...seletedId];
        return true;
      }
      // 全市全区
      if (item.selectId === item.parentId) {
        seletedId = [_.get(item, 'provinceId'), _.get(item, 'cityId'), _.get(item, 'districtId'), ...seletedId];
        return true;
      }
    });
    result = result.filter(item => {
      if (!seletedId.includes(item.selectId)) {
        return true;
      }
      // 全市全区
      if (item.selectId === item.parentId) {
        return true;
      }
    });
    result = [...this.selection, ...result];
    let labels = [],
      selectId = [];
    result.forEach(v => {
      labels.push(v.name);
      selectId.push(v.selectId);
    });
    type === 'echo' ? null : this.setCacheTotalTree();
    this._label = labels.join(',');
    this.onChangeCallback(selectId);
    this.onChange.emit(result);
  }

  handleTotleTree() {
    this.totalTree = this.getCacheTotalTree();
    this.totalTree.length ? this.handleResult('echo') : null;
  }
  /**
   * input checked
   */
  itemsIsChecked(type, item) {
    switch (type) {
      case 'province':
        return this.checkedProArr.includes(item.id);
      case 'city':
        return this.checkedCityArr.includes(item.id);
      case 'district':
        return this.checkedDistrictArr.includes(item.id);
    }
  }
  /**
   * input disabled
   * @param type
   * @param item
   */
  itemsIsDisabled(type, item) {
    switch (type) {
      case 'province':
        return this.disabledProArr.includes(item.id);
      case 'city':
        return this.disabledCityArr.includes(item.id);
      case 'district':
        return this.disabledDistrictArr.includes(item.id);
    }
  }

  setCache(id: string, data) {
    try {
      let cacheAreaStr = sessionStorage.getItem('cacheAreaData') || '{}';
      let cacheArea = JSON.parse(cacheAreaStr);
      cacheArea[id] = data;
      let newCache = JSON.stringify(cacheArea);
      sessionStorage.setItem('cacheAreaData', newCache);
    } catch (e) {}
  }

  getCache(id: string) {
    try {
      let cacheAreaStr = sessionStorage.getItem('cacheAreaData') || '{}';
      let cacheArea = JSON.parse(cacheAreaStr);
      return cacheArea[id] || [];
    } catch (e) {
      return [];
    }
  }

  setCacheTotalTree() {
    try {
      sessionStorage.removeItem('areaTotleTree');
      let newCache = JSON.stringify(this.totalTree);
      sessionStorage.setItem('areaTotleTree', newCache);
    } catch (e) {}
  }

  getCacheTotalTree() {
    try {
      let cacheTreeStr = sessionStorage.getItem('areaTotleTree') || '[]';
      let cacheTree = JSON.parse(cacheTreeStr);
      return cacheTree || [];
    } catch (e) {
      return [];
    }
  }

  track(i, v) {
    return v.id;
  }
}
