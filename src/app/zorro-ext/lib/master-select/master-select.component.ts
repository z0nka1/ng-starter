import { Component, OnInit, Input, forwardRef, NgModule, TemplateRef, Output, EventEmitter, ViewChild, ViewContainerRef, ElementRef, ContentChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { CommonModule, NgForOfContext } from "@angular/common";
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { API } from '../services/api';
import { Subject } from 'rxjs/Rx';

export interface Master {
    preview: string;
    realName?: string;
    mobile?: string;
    id?: string;
    disabled?: boolean;
}

export interface DomOpt {
    hasBankCard: boolean;
    mobile: string;
    realName: string;
}

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MasterSelectComponent),
    multi: true
};

@Component({
    selector: `yzt-master`,
    template: `
    <div class="master-select">
        <nz-select 
            class="master-nz-select"
            [nzServerSearch]="true"
            nzShowSearch
            [style.width]="_width" 
            [nzPlaceHolder]="placeholder"
            [nzMode]="_nzMode"
            [nzAllowClear]="_allowClear"
            (nzOnSearch)="yztSearchChange($event)"
            (nzOpenChange)="yztOpenChange($event)"
            [(ngModel)]="value">
            <nz-option
                #domOpt
                *ngFor="let option of options"
                [nzLabel]="option.preview"
                [nzValue]="option"
                [nzDisabled]="option.disabled">
            </nz-option>
            <nz-option *ngIf="loading" nzDisabled nzCustomContent>
              <i class="anticon anticon-loading anticon-spin loading-icon"></i> 加载中...
            </nz-option>
            <nz-option *ngIf="_content" nzCustomContent>
                <ng-template>
                    <ng-container #nzOptionCon [ngTemplateOutlet]="_content" [ngTemplateOutletContext]="option"></ng-container>
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
    </div>
    `,
    styles: [`
    .master-select{
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
    .master-nz-select:hover +.close-icon {
        opacity: 1;
    }
    `],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class MasterSelectComponent implements ControlValueAccessor, OnInit {

    @ViewChild("domOpt") domOpt: DomOpt;
    private onTouchedCallback: () => () => {};
    private onChangeCallback: (_: any) => () => {};

    options: Array<Master> = [];
    // 单选的时候传字符串，多选传数组
    _value: string;
    _width = "100%";
    _content: TemplateRef<any>;
    _allowClear = true;
    _nzMode = "default";
    // 下拉过滤含关键字选项，false为不过滤
    _filter = false;
    currentText = '';
    canQuery = true;
    keyWordStream = new Subject<string>()
    keyWord$: any;
    regExpNum: RegExp = /^[0-9]*$/;

    loading: boolean;
    @Input() placeholder = "请输入收货人";
    // 需要获取的值类型
    @Input() valueType = "object";
    // 显示在输入框的值（名字、电话、名字+电话）
    @Input() valueField = "realName";

    // 设置属性，并触发监听器
    set value(v: any) {
        if (typeof v === 'string' && v.trim() === '' || !v)
            this.queryData('', []);
        this._value = v;
        // 双向绑定获取对象
        if (this.valueType === "object") {
            this.onChangeCallback(v);
        } else {
            let realName = v.realName || v;
            let mobile = v.mobile || v;
            this.valueType === "mobile" ? this.onChangeCallback(mobile) : this.onChangeCallback(realName);
        }
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

    @Input() set customTemplate(tpl: TemplateRef<any>) {
        if (tpl instanceof TemplateRef) {
            this._content = tpl;
        }
    }

    @Output() openChange: EventEmitter<any> = new EventEmitter();
    @Output() outOptions: EventEmitter<any> = new EventEmitter();
    @Output() nzOpenChange: EventEmitter<any> = new EventEmitter();

    constructor(private api: API) {
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

    yztSearchChange(inputValue) {
        if (!inputValue) return;
        this.canQuery = true;
        this.currentText = inputValue;
        this.keyWordStream.next(inputValue);
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
        this.nzOpenChange.emit(nzOpen);
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
    queryData(searchText?: string, options?: Array<Master>) {
        if (!this.canQuery) return;

        let qryParams = {
            realName: "",
            mobile: ""
        }
        if (this.regExpNum.test(searchText)) {
            qryParams.mobile = searchText;
        } else {
            qryParams.realName = searchText;
        }

        this.api.call("UserWorkerController.findMasterByNameOrAccount", qryParams).ok(json => {
            const result = json.result || [];
            this.options = result;
            this.options.forEach(item => {
                item.preview = item[this.valueField];
            });
            this.outOptions.emit(this.options);
        }).fail(err => {
            if (!this.options.length) {
                const lastItem = new Array<Master>({ id: "empty", preview: "没有更多选项！", disabled: true });
                this.options = options.concat(lastItem);
                this.canQuery = false;
                return;
            }
            throw new Error(err);
        });
    }


}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
    ],
    declarations: [
        MasterSelectComponent
    ],
    exports: [MasterSelectComponent]
})
export class MasterSelectModule { }