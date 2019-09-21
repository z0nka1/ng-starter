import { Component, OnInit, Input, forwardRef, NgModule, TemplateRef, Output, EventEmitter, ViewChild, ViewContainerRef, ElementRef, ContentChild, SimpleChange } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { CommonModule, NgForOfContext } from "@angular/common";
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Subject } from 'rxjs/Rx';
import { ApiService } from '../services/api.service';

export interface Staff {
    name: string;
    jobNum: string;
    organizeCode?: string;
    disabled?: boolean;
}

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StaffSelectComponent),
    multi: true
};

@Component({
    selector: `yzt-staff-select`,
    template: `
    <div class="staff-select">
        <nz-select 
            class="staff-nz-select"
            [nzServerSearch]="true"
            nzShowSearch
            [style.width]="_width" 
            [nzPlaceHolder]="placeholder"
            [nzMode]="_nzMode"
            [nzAllowClear]="_allowClear"
            (nzOnSearch)="yztSearchChange($event)"
            (nzScrollToBottom)="yztScrollToBottom()"
            (nzOpenChange)="yztOpenChange($event)"
            [nzDisabled]="yztDisabled"
            [(ngModel)]="value">
            <ng-container *ngFor="let option of options">
                <nz-option
                    *ngIf="!loading"
                    [nzLabel]="option.name"
                    [nzValue]="option"
                    [nzDisabled]="option.disabled">
                </nz-option>
            </ng-container>
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
    .staff-select{
        position: relative;
    }
    .close-icon {
        opacity: 0;
        position: absolute;
        right: 20px;
        top: 50%;
        margin-top: -6px;
    }
    .close-icon:hover {
        opacity: 1;
    }
    .staff-nz-select:hover +.close-icon {
        opacity: 1;
    }
    :host ::ng-deep .ant-select-disabled .ant-select-selection {
        background: #f0f0f0;
        color: #2b2b2b;
    }
    `],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class StaffSelectComponent implements ControlValueAccessor, OnInit {

    private onTouchedCallback: () => () => {};
    private onChangeCallback: (_: any) => () => {};

    options: Array<Staff> = [];
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
    firstNum = 1;
    loading = false;
    _jobNum = ""; // 控制回显

    @Input() placeholder = "请输入";
    @Input() rowsNum = 9999;
    @Input() valueType = "";
    @Input() protocolType = "";
    @Input() yztDisabled = false;

    set value(v: any) {
        if (typeof v === 'string' && v.trim() === '' || !v) {
            this.canQuery = true;
            this.firstNum = 1;
            this.options = [];
            this.currentText = '';
            this._value = null;
            return;
        }
        this._value = v;
        // 双向绑定获取对象
        if (v && this._nzMode === 'multiple') {
            // 外部回显时是code，用户选择时为jobNum, 需要此处判断最终输出为{jobNum: '', name: ''}
            const staffArr = v.map(item => {
                if (item.code) {
                    _.pick(item, ['code', 'name']);
                    item['jobNum'] = item.code;
                    delete item.code;
                    return item;
                } else {
                    return _.pick(item, ['jobNum', 'name'])
                }
            });
            this.onChangeCallback(staffArr);
        } else {
            if (this.valueType === "object") {
                const { jobNum, name } = v;
                this.onChangeCallback({ value: jobNum, label: name });
            } else if (this.valueType === "fullObject") {
                this.onChangeCallback(v);
            } else if (this.valueType === "name") {
                this.onChangeCallback(v.name);
            } else {
                this.onChangeCallback(v.jobNum);
            }
        }
    }

    get value(): any {
        return this._value;
    };

    @Input() set width(v: any) {
        const width = parseInt(v);
        this._width = (<any>Array.from(v)).includes("%") ? `${v}%` : isNaN(width) ? this._width : `${width}px`;
    }

    @Input() set optionMode(v) {
        this._nzMode = v;
        this._allowClear = v === "default" ? true : false;
    };

    @Input() set customTemplate(tpl: TemplateRef<any>) {
        if (tpl instanceof TemplateRef) {
            this._content = tpl;
        }
    }

    @Output() nzOpenChange: EventEmitter<any> = new EventEmitter();
    @Output() outOptions: EventEmitter<any> = new EventEmitter();

    constructor(private api: ApiService) {
    }

    ngOnInit() {
        // 限流
        this.keyWord$ = this.keyWordStream
            .debounceTime(250)
            .subscribe(word => {
                if (word) {
                    this.queryData(word, [])
                }
            });
    }

    ngOnDestroy() {
        this.keyWord$.unsubscribe()
    }

    yztSearchChange(inputValue) {
        if (!inputValue) return;
        this.canQuery = true;
        this.currentText = inputValue;
        this.firstNum = 1;
        this.keyWordStream.next(inputValue);
    }

    yztScrollToBottom() {
        this.queryData(this.currentText, this.options);
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
        if (!!value && typeof value === 'object' && value.length) {
            // eg var users = [
            //     { 'user': 'barney', 'active': true },
            //     { 'user': 'fred', 'active': false },
            //     { 'user': 'pebbles', 'active': false }
            // ] 转为 ['barney', 'fred', 'pebbles']
            this._jobNum = _.map(value.map(item => _.pick(item, ['code'])), 'code');
            setTimeout(_ => {
                this.value = [];
                this.queryData(value.name, []);
            })
        }
        if (!!value && value !== this._value) {
            setTimeout(_ => {
                this.value = value;
            })
        } else if (value === null && value !== this._value) {
            this.value = value;
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
     * 结构，取每个content对象下的orgUsers的人员数组，合并成一个新数组
     * "content": [
     *     {
     *         "code": "180328000004",
     *         "name": "广州一智通供应链管理有限公司",
     *         "orgUsers": [
     *             {
     *                 "jobNum": "123123",
     *                 "name": "张三",
     *             }
     *         ]
     *     }
     * ]
     */
    queryData(searchText?: string, options?: Array<Staff>, firstIn: boolean = false) {
        if (!this.canQuery) return;

        this.api.getTaskPermissionOutletsUser([{}]).subscribe(json => {
            // 格式化
            let content = _.get(json, 'content', []).map(org => org['orgUsers']);
            content = _.flattenDeep(content).map(item => _.pick(item, ['jobNum', 'name']));

            this.options = options.concat(content);
            this.firstNum += 1;
            if (!!this._jobNum && typeof this._jobNum === 'object' && this.value) {
                let tempOption;
                (<any>this._jobNum).map(num => {
                    tempOption = this.options.filter(opt => num === opt.jobNum);
                    (<any>this.value).push(tempOption[0]);
                })
            }
            this.loading = false;

            if (content.length < this.rowsNum) {
                this.options.push({ jobNum: "empty", name: "没有更多选项！", disabled: true });
                this.canQuery = false;
            }
        })
    }


}

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgZorroAntdModule,
    ],
    declarations: [
        StaffSelectComponent
    ],
    exports: [StaffSelectComponent]
})
export class StaffSelectModule { }