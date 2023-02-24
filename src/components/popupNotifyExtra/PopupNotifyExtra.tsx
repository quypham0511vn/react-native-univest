import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import Modal from 'react-native-modal';

import IcClose from '@/assets/images/ic_close_gray.svg';
import { Configs } from '@/commons/Configs';
import { ExtraData, NotificationPopupModel } from '@/models/notification-popup';
import { COLORS, HtmlStyles, IconSize, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '../elements';
import { BUTTON_STYLES } from '../elements/button/constants';
import { Button } from '../elements/button/index';
import { PopupActions, PopupProps } from './types';

const PopupNotifyExtra = forwardRef<PopupActions, PopupProps>(
    ({
        isIcon,
        icon,
        hasButton,
        onPressAction,
        onClose
    }: PopupProps, ref) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [data, setData] = useState<NotificationPopupModel>();

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const showData = useCallback((item: NotificationPopupModel) => {
            setData(item);
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            onClose?.();
        }, [onClose]);

        useImperativeHandle(ref, () => ({
            show,
            showData,
            hide
        }));

        const _onPressAction = useCallback((action: ExtraData) => {
            setVisible(false);
            onPressAction?.(action);
        }, []);

        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={() => {
                    return !hasButton && hide();
                }}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>
                    <Touchable
                        style={styles.close}
                        onPress={hide}>
                        <IcClose
                            {...IconSize.size20_20} />
                    </Touchable>

                    {isIcon ? <View style={styles.ic}>{icon}</View> : null}

                    <Text style={styles.txtTitle}>{data?.title}</Text>
                    <View
                        style={styles.txtContent}>
                        <HTMLView
                            stylesheet={HtmlStyles || undefined}
                            value={`<a>${data?.body}</a>`}
                        />
                    </View>

                    <View style={styles.button}>
                        {data?.extra?.map(item => {
                            return <Button
                                onPress={() => _onPressAction(item)}
                                label={item.text}
                                buttonStyle={BUTTON_STYLES.RED}
                                style={styles.btn}
                            />
                        })}
                    </View>
                </View>
            </Modal>
        );
    });

export default PopupNotifyExtra;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 15,
        borderWidth: 1,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    close: {
        position: 'absolute',
        right: Configs.FontSize.size10,
        top: Configs.FontSize.size7,
        zIndex: 99999
    },
    ic: {
        marginTop: 10,
        width: Configs.IconSize.size39,
        height: Configs.IconSize.size39
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size17,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginTop: 20
    },
    txtContent: {
        marginVertical: 10,
        marginHorizontal: 20
    },
    button: {
        flexDirection: 'column'
    },
    btn: {
        width: SCREEN_WIDTH - Configs.IconSize.size100,
        height: Configs.FontSize.size40,
        marginTop: 10,
        marginHorizontal: 5
    }
});
