import { action, makeObservable, observable } from 'mobx';


export class FastAuthInfo {
  @observable isEnableFastAuth = false;
  
  @observable supportedBiometry = '';

  constructor() {
      makeObservable(this);
  }

  @action setEnableFastAuthentication(fastAuth: boolean) {
      this.isEnableFastAuth = fastAuth;
  }

  @action setSupportedBiometry(isSupported: string) {
      this.supportedBiometry = isSupported;
  }
}
