import { configure } from 'mobx';
import { Observer, useLocalObservable } from 'mobx-react-lite';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import Toast from 'react-native-easy-toast';

import Validate from '@/utils/Validate';
import { EventEmitter } from '@/utils/EventEmitter';
import { Events } from '@/commons/constants';
import { TOAST_POSITION } from '../../commons/Configs';
import { COLORS } from '../../theme';
import { PopupContext } from './context';

configure({
    enforceActions: 'never'
});

export const PopupsProvider = ({ children }: any) => {
    const toastRef = useRef(null);
    const [toastType, setToastType] = useState('MSG');

    const showToast = useCallback((obj) => {
        const { type, msg } = obj;
        if (toastRef?.current && !Validate.isStringEmpty(msg)) {
            setToastType(type);
            toastRef?.current?.show(msg, 2000);
        }
    }, []);

    useEffect(() => {
        const listener = EventEmitter.addListener(Events.TOAST, showToast);
        return () => {
            listener.remove();
        };
    }, [showToast]);

    const store = useLocalObservable(() => ({
        isVisible: false,
        data: {}
    }));

    const handleShowDialog = useCallback((data) => {
        store.isVisible = true;
        store.data = data;
    }, [store]);

    const handleCloseDialog = useCallback(() => {
        store.isVisible = false;
        store.data = {};
    }, [store]);

    const contextValue = useMemo(
        () => ({
            close: handleCloseDialog,
            show: handleShowDialog
        }),
        [handleCloseDialog, handleShowDialog]
    );

    const renderPopup = useCallback(() => {
        if (store.isVisible) {
            const type = (store?.data as any).type;
            switch (type) {
                default: return null;
            }
        }
        return null;
    }, [store?.data, store.isVisible]);

    const toastBackground = useMemo(() => {
        let color = COLORS.BLACK;
        switch (toastType) {
            case 'MSG':
                color = COLORS.BLACK;
                break;
            case 'ERR':
                color = COLORS.RED;
                break;
            case 'SUCCESS':
                color = COLORS.GREEN;
                break;
            default: break;
        }
        return [styles.toast, { backgroundColor: color }];
    }, [toastType]);

    const toastPosition = useMemo(() => {
        return toastType === 'MSG' ? 'bottom' : 'top';
    }, [toastType]);

    const renderToast = useMemo(() => {
        return <Toast
            ref={toastRef}
            position={toastPosition}
            style={toastBackground}
            positionValue={TOAST_POSITION}
        />;
    }, [toastBackground, toastPosition]);

    return (<>
        <PopupContext.Provider value={contextValue}>
            {children}
        </PopupContext.Provider>
        <Observer>
            {renderPopup}
        </Observer>
        {renderToast}
    </>
    );
};

const styles = StyleSheet.create({
    toast: {
        borderRadius: 10,
        padding: 10
    }
});
