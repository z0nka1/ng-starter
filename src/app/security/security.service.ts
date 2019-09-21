import {Injectable} from "@angular/core";
import {Body, POST, RebirthHttp, BaseUrl} from "rebirth-http";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {securityURL} from "../config/config";

@Injectable({
    providedIn: 'root'
})
@BaseUrl(securityURL)
export class VerifyService extends RebirthHttp {
    constructor(http: HttpClient) {
        super(http);
    }

    // 获取验证码
    @POST('/manage/user/verificationCode')
    getVerifyCode(@Body params): Observable<any> {
        return null;
    }
}

