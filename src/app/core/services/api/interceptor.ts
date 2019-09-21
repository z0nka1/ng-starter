/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-01-30 14:24:34
 * @description: http 拦截器统一拦截处理
 */



import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IpsApiService } from '@zorro-ext/lib/services/api';
import { API_BASE_URL, IGNORE_API_INTERCEPT, TOKEN_KEY } from 'app/config/config';
import { NzNotificationService } from 'ng-zorro-antd';
import { RebirthHttpProvider } from 'rebirth-http';
import { AuthService } from '../auth/auth.service';
import { ReStorageService } from '../storage/storage.service';


/**附件类型 */
const ATTACHMENT_TYPE = [
    'application/msexcel',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.excel',
    '.download',
];

@Injectable()
export class InterceptorService {

    constructor(
        private rebirthHttpProvider: RebirthHttpProvider,
        private storage: ReStorageService,
        private auth: AuthService,
        private _notification: NzNotificationService,
        private ipsSrv: IpsApiService
    ) {

    }

    /**http请求全局拦截器 */
    setup() {
        this.rebirthHttpProvider
            .baseUrl(API_BASE_URL)
            .addInterceptor({
                request: request => {
                    if (this.isIgnoreApiUrl(request.url)) {
                        return;
                    }
                    let token = this.storage.get(TOKEN_KEY) || 'anonymous.anonymous';
                    let requestOpt = {
                        setHeaders: { Authorization: `Bearer ${token}` }
                    }
                    if (this.isDownload(request.url)) {
                        requestOpt['responseType'] = 'blob';
                    }
                    return request.clone(requestOpt);
                },
                response: (response: HttpResponse<any>) => {
                    if (response instanceof Error || this.isIgnoreApiUrl(response.url)) {
                        // new Error，避免两次 notification
                        return;
                    }
                    // 接口统一错误提示
                    let body = response.body || {};
                    let resultCode = body.code;
                    if (resultCode === 4100 || resultCode === "4100") {
                        // 没有权限
                        return this.auth.logout();
                    } else if (resultCode !== '2000' && resultCode !== 2000 && resultCode !== 4100 && !this.isAttachment(response)) {
                        // 如果时附件接口（上边request设置responseType位Blob了），则需要对返回结果进行处理
                        if (body instanceof Blob) {
                            this.handlerBlobResponse(body);
                        } else {
                            this._notification.create('error', '错误提示', body.msg || body.error || '服务异常', { nzDuration: 4000 });
                        }
                        // 抛出异常，避免进入success回调
                        throw new Error(body || '服务异常');
                    }
                }
            })
            .addResponseErrorInterceptor((res: HttpErrorResponse) => {
                if (res.status && [401, 403].indexOf(res.status) !== -1) {
                    return this.auth.logout();
                }
            });
    }

    private isIgnoreApiUrl(url: string) {
        if (!url) {
            return false;
        }
        return IGNORE_API_INTERCEPT.some(u => {
            return url.includes(u)
        })
    }

    private isAttachment(response: HttpResponse<any>) {
        let conType = response.body.type;
        return ATTACHMENT_TYPE.includes(conType);
    }

    private isDownload(url) {
        if (!url) {
            return false;
        }
        return ATTACHMENT_TYPE.some(u => {
            return url.includes(u);
        })
    }

    private handlerBlobResponse(body: Blob) {
        const reader = new FileReader();
        reader.addEventListener("loadend", () => {
            //reader.result
            let _body = JSON.parse((<any>reader).result);
            this._notification.create('error', '错误提示', _body.msg || '服务异常', { nzDuration: 4000 });
        });
        reader.readAsText(body);
    }
}
