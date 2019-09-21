import { Component, OnInit, Input, forwardRef, NgModule, TemplateRef, Output, EventEmitter, ViewChild, ViewContainerRef, ElementRef, ContentChild, SimpleChange } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from "@angular/forms";
import { CommonModule, NgForOfContext } from "@angular/common";
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { Subject } from 'rxjs/Rx';
import { ApiService } from '../services/api.service';

export interface Carrier {
    name: string;
    carrierCode: string;
    disabled?: boolean;
}

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CarrierSelectComponent),
    multi: true
};

@Component({
    selector: `yzt-carrier`,
    template: `
    <div class="carrier-select">
        <nz-select 
            class="carrier-nz-select"
            [nzServerSearch]="true"
            nzShowSearch
            [style.width]="_width" 
            [nzPlaceHolder]="placeholder"
            [nzMode]="_nzMode"
            [nzAllowClear]="_allowClear"
            (nzScrollToBottom)="yztScrollToBottom()"
            (nzOnSearch)="yztSearchChange($event)"
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
    .carrier-select{
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
    .carrier-nz-select:hover +.close-icon {
        opacity: 1;
    }
    :host ::ng-deep .ant-select-disabled .ant-select-selection {
        background: #f0f0f0;
        color: #2b2b2b;
    }
    `],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CarrierSelectComponent implements ControlValueAccessor, OnInit {

    private onTouchedCallback: () => () => {};
    private onChangeCallback: (_: any) => () => {};

    options: Array<Carrier> = [];
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

    @Input() carrierCode = "";
    @Input() placeholder = "请输入承运商";
    @Input() rowsNum = 10;
    @Input() valueType = "";
    @Input() protocolType = "";
    @Input() yztDisabled = false;

    set value(v: any) {
        if (typeof v === 'string' && v.trim() === '' || !v) {
            this.canQuery = true;
            this.firstNum = 1;
            this.options = [];
            this.currentText = '';
            this.carrierCode = '';
            // this.queryData('', []); // 空值不走查询
            this._value = null;
            return;
        }
        this._value = v;
        // 双向绑定获取对象
        if (this.valueType === "object") {
            const { carrierCode, name } = v;
            this.onChangeCallback({ value: carrierCode, label: name });
        } else if (this.valueType === "fullObject") {
            this.onChangeCallback(v);
        } else if (this.valueType === "name") {
            this.onChangeCallback(v.name);
        } else {
            this.onChangeCallback(v.carrierCode);
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

    ngOnChanges(changes: any) {
        if (changes.carrierCode && this.carrierCode) {
            this.firstNum = 1;
            this.loading = true;
            this.canQuery = true;
            setTimeout(_ => {
                this.queryData(this.carrierCode, [], true);
            })
        }
    }

    ngOnDestroy() {
        this.keyWord$.unsubscribe()
    }

    yztSearchChange(inputValue) {
        if (!inputValue) return;
        this.canQuery = true;
        this.currentText = inputValue;
        this.firstNum = 1;
        this.carrierCode = ''; // 重新搜索清空回显code
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
        if (!!value && value !== this._value) {
            // this._value = value;
            setTimeout(() => {
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
     */
    queryData(searchText?: string, options?: Array<Carrier>, firstIn: boolean = false) {
        if (!this.canQuery) return;
        let params;
        if (this.carrierCode) {
            params = [{ "page": this.firstNum, "size": this.rowsNum }, { key: this.carrierCode, status: "normal" }];
        } else {
            params = [{ "page": this.firstNum, "size": this.rowsNum }, { key: searchText, status: "normal" }];
        }
        // 默认不传参数
        // let params = [{ "page": this.firstNum, "size": this.rowsNum }, {}];

        this.api.findCarrierList(params).subscribe(json => {
            let content = json && json['content'] || {};
            let result = content['content'] || []

            this.options = options.concat(result);
            this.firstNum += 1;
            if (firstIn || this.carrierCode) {
                this.value = this.options[0];
            }
            this.loading = false;

            if (result.length < this.rowsNum) {
                this.options.push({ carrierCode: "empty", name: "没有更多选项！", disabled: true });
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
        CarrierSelectComponent
    ],
    exports: [CarrierSelectComponent]
})
export class CarrierSelectModule { }