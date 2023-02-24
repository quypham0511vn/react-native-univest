import { action, makeObservable, observable } from 'mobx';

import { UserInfoModel } from '@/models/user-model';
import SessionManager from './SessionManager';

export class UserManager {
    @observable userInfo?: UserInfoModel = SessionManager.userInfo;

    constructor() {
        makeObservable(this);
    }

    @action updateUserInfo(userInfo: any) {
        this.userInfo = userInfo;
        SessionManager.setUserInfo(userInfo);
    }
}
