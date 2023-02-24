import { NetInfoState } from '@react-native-community/netinfo';
import { action, makeObservable, observable } from 'mobx';

export class NetworkManager {
    @observable networkState : NetInfoState | undefined;

    constructor() {
        makeObservable(this);
    }

    @action setNetworkState(networkState: NetInfoState) {
        if (networkState?.isConnected !== this.networkState?.isConnected) {
            this.networkState = networkState;
        }
    }
}
