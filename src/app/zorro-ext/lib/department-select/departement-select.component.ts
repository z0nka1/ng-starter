import { Component, OnInit, NgModule, ViewChild, TemplateRef, Input, Output, EventEmitter, forwardRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { UISelectBoxModule } from '../select-box/select-box.component';
import { Subject } from 'rxjs';
import { ApiService } from '../services/api.service';
import { NgZorroAntdModule, NzOptionSelectionChange } from 'ng-zorro-antd';

declare var _: any;

export interface Department {
    code?: string;
    name?: string;
    departments?: any;
    disabled?: boolean;
    [key: string]: any;
}
export interface DomOpt {
    code: string;
    fullName: string;
    id: string;
    name: string;
    remark: string;
}

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DepartmentSelectComponent),
    multi: true
};
@Component({
    selector: 'yzt-department',
    template: `
    <div class="department-select">
    <nz-select
        class="department-nz-select"
        [style.width]="_width"
        [nzPlaceHolder]="placeholder"
        [nzMode]="_nzMode"
        [(ngModel)]="value"
        (nzOnSearch)="yztSearchChange($event)"
        (nzOpenChange)="yztOpenChange($event)"
        [nzServerSearch]="true"
        [nzAllowClear]="_allowClear"
        nzShowSearch
        >
        <nz-option #domOpt *ngFor="let option of options;let i=$index" [nzLabel]="option.name" [nzDisabled]='option.disabled' [nzValue]='option'>
            <ng-template *ngIf="_contentCompany" #nzOptionTemplate>
                <ng-container [ngTemplateOutlet]="_contentCompany" [ngTemplateOutletContext]="option"></ng-container>
            </ng-template>
        </nz-option>
    </nz-select>
    <span
      role="close-icon"
      (click)="clearSelect($event)"
      class="ant-select-selection__clear close-icon"
      style="-webkit-user-select: none;"
      *ngIf="!_allowClear&&options.length">
    </span>
    </div>`,
    styles: [`
    .department-select{
        position: relative;
    }
    .close-icon {
        opacity: 0;
        position: absolute;
        right: 20px;
        top: 50%;
        margin-top: -10px;
    }
    .close-icon:hover {
        opacity: 1;
    }
    .department-nz-select:hover +.close-icon {
        opacity: 1;
    }
  `],
    /* <nz-option *ngFor="let obj of option.departments" [nzLabel]="obj.name" [nzValue]="obj">
    <ng-template *ngIf="_contentDepartment" #nzOptionTemplate>
        <ng-container [ngTemplateOutlet]="_contentDepartment" [ngTemplateOutletContext]="obj"></ng-container>
    </ng-template>
  </nz-option> */
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class DepartmentSelectComponent implements ControlValueAccessor, OnInit {
    options: Array<Department> = [];
    // 单选的时候传字符串，多选传数组
    _value: any;
    _width = "100%";
    _allowClear = true;
    _nzMode = "default";
    // 下拉过滤含关键字选项，false为不过滤
    _filter = false;
    currentText = '';
    canQuery = true;
    keyWordStream = new Subject<string>()
    keyWord$: any;
    _contentCompany: TemplateRef<any>;
    _contentDepartment: TemplateRef<any>;

    _dmptCode: string; // 原来控制回显

    @ViewChild("domOpt") domOpt: DomOpt;

    @Input() placeholder = "请输入网点名称搜索";
    // 需要获取的值类型 code | name | object
    @Input() valueType = "code";
    @Input()
    set nzMode(v: string) {
        this._nzMode = v;
    }

    @Output()
    onSelectChange: EventEmitter<any> = new EventEmitter<any>();

    private onTouchedCallback: () => () => {};
    private onChangeCallback: (_: any) => () => {};

    // 设置属性，并触发监听器
    set value(v: any) {
        if (typeof v === 'string' && v.trim() === '' || !v) {
            this._dmptCode = v;
            this.queryData('', []);
            this._value = v;
            this.onChangeCallback(v);
            return;
        }
        this._value = v;

        this.dataHandler(v);
        this.onSelectChange.emit(v);
    }

    get value(): any {
        return this._value;
    };

    @Input() set width(v: any) {
        const width = parseInt(v);
        this._width = (<any>Array.from(v)).includes("%") ? `${v}%` : isNaN(width) ? this._width : `${width}px`;
    }

    @Input() set OptionMode(v) {
        this._nzMode = v;
        this._allowClear = v === "default" ? true : false;
    };

    @Input() set customCompanyTemplate(tpl: TemplateRef<any>) {
        if (tpl instanceof TemplateRef) {
            this._contentCompany = tpl;
        }
    }

    @Input() set customDepartmentTemplate(tpl: TemplateRef<any>) {
        if (tpl instanceof TemplateRef) {
            this._contentDepartment = tpl;
        }
    }

    @Output() openChange: EventEmitter<any> = new EventEmitter();
    @Output() outOptions: EventEmitter<any> = new EventEmitter();

    constructor(private api: ApiService) {
    }

    ngOnInit() {
        // 限流
        this.keyWord$ = this.keyWordStream
            .debounceTime(250)
            .subscribe(word => {
                this.queryData(word, [])
            });
    }

    ngOnDestroy() {
        this.keyWord$.unsubscribe()
    }

    yztOpenChange(nzOpen: boolean) {
        if (nzOpen) {
            // 当前ngModel有值时，下拉选择无内容时对当前值搜索一次
            if (!this.options.length || (this.options.length === 1 && this.options[0]['disabled'])) {
                this.canQuery = true;
                let keyword = this.value ? this.value.name : '';
                this.queryData(keyword, []);
            }
        }
    }

    yztSearchChange(inputValue: string) {
        if (!inputValue) return;
        this.canQuery = true;
        this.currentText = inputValue;
        this.keyWordStream.next(inputValue);
    }

    dataHandler(v: Department | Array<Department>) {
        let isArray = _.isArray(v);
        // 双向绑定获取对象
        if (this.valueType === "object") {
            this.onChangeCallback(v);
        } else if (this.valueType === "code") {
            let code = isArray ? _.map(v, 'code') : v['code'];
            this.onChangeCallback(isArray ? _.compact(code) : code)
        } else if (this.valueType === "name") {
            let name = isArray ? _.map(v, 'name') : v['name'];
            this.onChangeCallback(isArray ? _.compact(name) : name);
        }
    }
    /**
     * 仅作清空多选选项
     */
    clearSelect($event?: MouseEvent): void {
        if ($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }
        this.options = [];
        this.value = '';
    }

    // 写入值
    writeValue(value: any) {
        if (!!value && typeof value === 'object') {
            if (_.isArray(value) && value.length > 0) {
                if (typeof value[0] === 'string') {
                    this.queryData("", [], value, true);
                } else if (typeof value[0] === 'object') {
                    this.queryData("", [], _.map(value, 'code'), true);
                }
            } else {
                this._dmptCode = value.code;
                this.queryData(value.name, []);
            }
        } else if (!!value && this.valueType === 'code') {
            this._dmptCode = value;
            this.queryData("", [], [value]);
        }
        if (value !== this._value) {
            this._value = value;
        }
    }
    // 注册变化处理事件
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }
    // 注册触摸事件
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }
    /**
     * 查询数据
     * @param $event
     */
    queryData(name?: string, options?: Array<Department>, codes?: string[], isArray?: boolean) {
        if (!this.canQuery) return;
        let isCodeQry = (codes && codes.length);
        if (!options) {
            options = [];
        }
        let backend = 'getOutlets';
        let body: Array<object> | Object = {
            name,
            status: "normal"
        };
        if (isCodeQry) {
            backend = 'getOutletsList';
            body = [{
                codes
            }];
        }

        this.api[backend](body).subscribe(json => {
            let dataList = (isCodeQry ? json.content : json.content.content) || [];
            this.options = [];
            for (let d of dataList) {

                if (!d.organizeName) {
                    continue;
                }
                let obj = {
                    "type": d.type,
                    "code": d.code,
                    "name": d.name,
                    "addressCode": d.address && d.address.areaCode,
                    "addressName": d.address && d.address.complete
                };

                this.options.push(obj);

                if (isCodeQry && isArray) {
                    this._value = this.options;
                    // this._value = _.cloneDeep(this.options);
                }
            }
            this.outOptions.emit(this.options);
            if (!this.options.length) {
                const lastItem = new Array<Department>({ code: "empty", name: "没有更多选项！", disabled: true });
                this.options = options.concat(lastItem);
                this.canQuery = false;
                return;
            } else {
                if (this._dmptCode) {
                    this.value = this.options[0];
                }
            }

        }, err => {
            if (!this.options.length) {
                const lastItem = new Array<Department>({ code: "empty", name: "没有更多选项！", disabled: true });
                this.options = options.concat(lastItem);
                this.canQuery = false;
                return;
            }
        });
    }

}
@NgModule({
    declarations: [
        DepartmentSelectComponent
    ],
    exports: [DepartmentSelectComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule
    ]
})
export class DepartmentSelectModule { }
