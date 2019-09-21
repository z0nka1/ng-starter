import { Injectable } from '@angular/core';
import { App, Layout, User } from './interface';
import { USER_INFO_KEY } from 'app/config/config';
import { ReStorageService } from '@core/services/storage/storage.service';

const KEY = 'layout';

@Injectable()
export class SettingsService {
    public app: App = {
        year: (new Date()).getFullYear()
    };

    private _user: User = {};

    get user(): User {
        return this.getUser();
    }

    public _layout: Layout = null;

    private get(key: string) {
        return JSON.parse(localStorage.getItem(key) || 'null') || null;
    }

    private set(key: string, value: any) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    get layout(): Layout {
        if (!this._layout) {
            this._layout = Object.assign(<Layout>{
                fixed: true,
                collapsed: false,
                boxed: false,
                theme: 'A',
                lang: null
            }, this.get(KEY));
            this.set(KEY, this._layout);
        }
        return this._layout;
    }

    constructor(
        private storage: ReStorageService,
    ) {
    }

    setLayout(name: string, value: any): boolean {
        if (typeof this.layout[name] !== 'undefined') {
            this.layout[name] = value;
            this.set(KEY, this._layout);
            return true;
        }
        return false;
    }

    setApp(val: App) {
        if (val === null) {
            return this.app = {};
        }
        this.app = Object.assign(this.app, val);
    }

    setUser(val: User) {
        if (val === null) {
            this.storage.save(USER_INFO_KEY, {});
            return this._user = {};
        }
        this._user = Object.assign(this._user, val);
        this.storage.save(USER_INFO_KEY, this._user);
    }

    getUser() {
        if (this._user.userCode) {
            return this._user;
        }
        return this.storage.get(USER_INFO_KEY) || {};
    }
}
