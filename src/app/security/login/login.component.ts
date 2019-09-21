import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { VerifyService } from "../security.service";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { NzMessageService } from "ng-zorro-antd";
import { ReStorageService } from "@core/services/storage/storage.service";
import { API_BASE_URL, TOKEN_KEY, USER_NAME } from "../../config/config";
@Component({
  selector: 'login-comp',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.less']
})
export class LoginComp implements OnInit {
  nowYear = new Date().getFullYear();
  loginForm: FormGroup;
  cannotClick = false; // 获取验证码按钮可否点击
  getVerifyBtnStr = '获取验证码'; // 获取验证码按钮文案
  loading = false;
  isMobileLogin = false; // 是否手机号登录
  constructor(
    public fb: FormBuilder,
    public verifyApi: VerifyService,
    public router: Router,
    public http: HttpClient,
    public msg: NzMessageService,
    public storage: ReStorageService,
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['111', Validators.required],
      password: ['111', Validators.required],
      phoneNo: [],
      verifyCode: [],
      remember: [false]
    })
  }

  login() {

    window.location.href = '/';

    return;
    if (!this.loginForm.valid) {
      return;
    }
    const formVal = this.loginForm.value;
    let params;
    params = {
      scope: 'openid',
      grant_type: 'password'
    };
    let qry: string;
    if (!this.isMobileLogin) {
      let data = _.pick(formVal, ['username', 'password']);
      params = {
        ...params,
        ...data
      };
      qry = `username=${params.username}&password=${params.password}&scope=${params.scope}&grant_type=${params.grant_type}`;
    } else {
      params = {
        ...params,
        type: 'verifyCode',
        username: formVal.phoneNo,
        verifycode: formVal.verifyCode
      };
      qry = `username=${params.username}&verifycode=${params.verifycode}&scope=${params.scope}&grant_type=${params.grant_type}&type=${params.type}`;
    }


    let url = `${API_BASE_URL}/oauth/token`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ZmFtaWx5OmFjbWVzZWNyZXQ='
      })
    };

    this.loading = true;
    this.http.post(url, qry, httpOptions).subscribe(
      res => {
        this.loading = false;
        if (res['code'] === 4100 || res['code'] === "4100") {
          this.msg.error(res['desc']);
          return;
        }
        const TOKEN = _.get(res, 'access_token');
        this.storage.remove(TOKEN_KEY, 1);
        this.storage.remove(TOKEN_KEY, 2);
        this.storage.save(TOKEN_KEY, TOKEN, formVal.remember ? 2 : 1);
        this.storage.save(USER_NAME, params.username, formVal.remember ? 2 : 1); //缓存用户名称
        window.location.href = '/';
      },
      err => {
        this.loading = false;
        let errMsg = _.get(err, 'error.error_description');
        this.msg.error(errMsg || '服务异常');
      }
    )
  }

  /**
   * 获取验证码
   */
  getVerifyCode() {
    this.cannotClick = true;
    this.getVerifyBtnStr = '60s后重新获取';
    let s = 59;
    let interval = setInterval(() => {
      this.getVerifyBtnStr = `${s--}s后重新获取`;
    }, 1000);
    setTimeout(() => {
      clearInterval(interval);
      this.cannotClick = false;
      this.getVerifyBtnStr = '获取验证码';
    }, 60000);

    this.verifyApi.getVerifyCode({
      mobile: this.loginForm.get('phoneNo').value
    }).subscribe()
  }

  /**
   * 账号登录/手机号登录切换
   * @param event
   */
  onTabClick(event) {
    let controls = [['phoneNo', 'verifyCode'], ['username', 'password']];
    if (event) {
      this.loginForm.get('phoneNo').setValidators([Validators.required, Validators.pattern(/[\d]{11}/)]);
      this.loginForm.get('verifyCode').setValidators([Validators.required, Validators.pattern(/[\d]{6}/)]);
    } else {
      controls[1].forEach(ctrl => {
        this.loginForm.get(ctrl).setValidators([Validators.required]);
      });
    }
    controls[event].forEach(ctrl => {
      this.loginForm.get(ctrl).clearValidators();
    });
    [...controls[0], ...controls[1]].forEach(ctrl => {
      this.loginForm.get(ctrl).updateValueAndValidity();
    });
    this.isMobileLogin = !!event;
  }
}
