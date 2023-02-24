import { action, makeObservable, observable } from "mobx";

export class NotifyManager {
  @observable totalNotifications = 0;
  @observable _HasNotify: boolean = false;
  
  constructor() {
    makeObservable(this);
  }

  @action setCountNotify(total: number) {
    if (total) this.totalNotifications = total;
    else this.totalNotifications = 0;
  }

  @action setHasNotify = (hasNotify: boolean) => {
    this._HasNotify = hasNotify;
  };
}
