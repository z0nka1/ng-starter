import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { NzModalService, ModalOptionsForService, ModalOptions } from 'ng-zorro-antd';

export interface ModalHelperOptions<T = any> extends ModalOptions<T> {
  [key: string]: any;
}

/**
 * 对话框辅助类
 */
@Injectable()
export class ModalHelper {
  private zIndex = 500;

  constructor(private srv: NzModalService) {
  }


  resetOptions(options: ModalHelperOptions): ModalHelperOptions {
    return {
      nzTitle: options.nzTitle || options.title,
      nzWrapClassName: options.wrapClassName,
      nzContent: options.nzContent || options.content,
      nzWidth: options.width ? options.width : undefined,
      nzFooter: options.footer || null,
      nzComponentParams: options.nzComponentParams || options.componentParams || {}
    };
  }

  /**
   * 打开对话框
   * this.modalHelper.open(FormEditComponent, { i }).subscribe(res => this.load());
   *
   * 对于组件的成功&关闭的处理说明：
   * 成功：
   *  this.NzModalRef.close(data);
   *  this.NzModalRef.close();
   *
   * 关闭：
   * this.NzModalRef.destroy();
   *
   * @param comp 组件
   * @param params 组件参数
   * @param size 大小；例如：lg、600，默认：lg
   * @param options 对话框 `ModalOptionsForService` 参数
   */
  openModal(
    comp: any,
    params?: any,
    size: 'sm' | 'lg' | '' | number = 'lg',
    options?: ModalOptionsForService,
  ): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      let cls = '',
        width = '';
      if (size) {
        if (typeof size === 'number') {
          width = `${size}px`;
        } else {
          cls = `modal-${size}`;
        }
      }
      const defaultOptions: ModalOptionsForService = {
        nzWrapClassName: cls,
        nzContent: comp,
        nzWidth: width ? width : undefined,
        nzFooter: null,
        nzMaskClosable: false,
        nzComponentParams: params,
        nzZIndex: ++this.zIndex,
      };
      const subject = this.srv.create(Object.assign(defaultOptions, options));
      const afterClose$ = subject.afterClose.subscribe((res: any) => {
        observer.next(res);
        observer.complete();
        afterClose$.unsubscribe();
      });
    });
  }
  /**
   * 兼容v0.6.15版本接口
   * @param options
   */
  open(
    options?: ModalHelperOptions,
  ): Observable<any> {
    return new Observable((observer: Observer<any>) => {
      let cls = '',
        width = options.width || '';

      if (options.size) {
        if (typeof options.size === 'number') {
          width = `${options.size}px`;
        } else {
          cls = `modal-${options.size}`;
        }
      }
      const defaultOptions: ModalOptionsForService = {
        nzTitle: options.nzTitle || options.title,
        nzWrapClassName: cls || options.wrapClassName,
        nzContent: options.nzContent || options.content,
        nzWidth: width ? width : undefined,
        nzFooter: options.footer || null,
        nzMaskClosable: false,
        nzComponentParams: options.nzComponentParams || options.componentParams || {},
        nzZIndex: ++this.zIndex,
      };
      const subject = this.srv.create(Object.assign(defaultOptions, options));
      const afterClose$ = subject.afterClose.subscribe((res: any) => {
        observer.next(res);
        observer.complete();
        afterClose$.unsubscribe();
      });
    });
  }

  /**
   * 静态框，点击蒙层不允许关闭
   */
  static(
    comp: any,
    params?: any,
    size: 'sm' | 'lg' | '' | number = 'lg',
    options?: any,
  ): Observable<any> {
    return this.openModal(
      comp,
      params,
      size,
      Object.assign(
        {
          maskClosable: false,
        },
        options,
      ),
    );
  }

  /**
     * 确定按钮会触发：
     * this.subject.destroy('onOk');
     * 取消按钮没任何返回
     *
     * @param {*} [options] 对话框ConfigInterface参数
     * @param ok
     * @param fail
     */
  confirm(options): Observable<any> {
    options.nzTitle = options.nzTitle || options.title;
    options.nzIconType = options.nzIconType || options.iconType || 'question-circle';
    return new Observable((observer: Observer<any>) => {
      const subject = this.srv.confirm(Object.assign({
        nzContent: '',
        // nzIconType: 'info-circle',
        nzOnOk: () => {
          subject.destroy('ok');
        },
        nzOnCancel: () => {
          subject.destroy('cancel');
        }
      }, options));
      const afterClose$ = subject.afterClose.subscribe((res: any) => {
        if (res === 'ok') {
          observer.next(res);
          observer.complete();
        }
        afterClose$.unsubscribe();
      });
    });
  }
}

