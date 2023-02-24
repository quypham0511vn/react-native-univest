import RNNetInfo from '@react-native-community/netinfo';
import { observer, useLocalObservable } from 'mobx-react';
import React, { useEffect, useRef, useMemo } from 'react';

import PopupNoInternet from '@/components/popup/PopupNoInternet';
import { PopupActions } from '@/components/popup/types';
import { useAppStore } from '@/hooks';
import { NetworkContext } from './context';


export const NetworkProvider = observer(({ children }: any) => {
    const popupRef = useRef<PopupActions>(null);
    const storeLocal = useLocalObservable(() => ({}));
    const { networkManager: networkInfo } = useAppStore();
    useEffect(() => {
        const unsubscribe = RNNetInfo.addEventListener(state => {
            if (!state?.isConnected) {
                popupRef.current?.show();
            }
            else {
                popupRef.current?.hide?.();
            }
        });
        return () => {
            unsubscribe();
        };
    }, [networkInfo, storeLocal]);

    const renderPopupNoInternet = useMemo(() => {
        return <PopupNoInternet
            ref={popupRef}
        />;
    }, [popupRef]);

    return (<>
        <NetworkContext.Provider value={storeLocal}>
            {children}
        </NetworkContext.Provider>
        { renderPopupNoInternet}
    </>
    );
});
