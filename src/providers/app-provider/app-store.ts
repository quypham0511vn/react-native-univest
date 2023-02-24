import { makeObservable, observable } from 'mobx';

import { ApiServices} from '@/api';
import { UserManager } from '@/managers/UserManager';
import { NetworkManager } from '@/managers/NetworkManager';
import { FastAuthInfo } from '@/managers/FastAuthenInfo';
import { NotifyManager } from '@/managers/NotifyManager';

class AppStore {
  @observable userManager = new UserManager();

  @observable networkManager = new NetworkManager();

  @observable fastAuthInfo = new FastAuthInfo();
  
  @observable notifyManager = new NotifyManager();

  apiServices = new ApiServices();

  constructor() {
      makeObservable(this);
  }
}

export type AppStoreType = AppStore;
export default AppStore;
