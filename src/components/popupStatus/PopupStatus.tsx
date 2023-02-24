import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import Modal from 'react-native-modal';

import IcClose from '@/assets/images/ic_close_gray.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { COLORS, HtmlStyles, IconSize, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '../elements';
import { BUTTON_STYLES } from '../elements/button/constants';
import { Button } from '../elements/button/index';
import { PopupActions, PopupProps } from './types';

const PopupStatus = forwardRef<PopupActions, PopupProps>(
    ({
        title,
        description,
        isIcon,
        icon,
        hasButton,
        onSuccessPress,
        onClose
    }: PopupProps, ref) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [__title, setTitle] = useState<any>(title);
        const [__content, setContent] = useState<any>(description);
        
        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const showCustom = useCallback((_title: string, _content: string) => {
            setTitle(_title);
            setContent(_content);
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            onClose?.();
        }, [onClose]);

        useImperativeHandle(ref, () => ({
            show,
            showCustom,
            hide
        }));

        const onCloseModal = useCallback(() => {
            setVisible(false);
        }, []);

        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={()=>{
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

                    <Text style={styles.txtTitle}>{__title}</Text>
                    <View
                        style={styles.txtContent}>
                        <HTMLView
                            stylesheet={HtmlStyles || undefined}
                            value={`<a>${__content}</a>`}
                        />
                    </View>

                    {
                        hasButton ? <View style={styles.button}>
                            <Button
                                onPress={onCloseModal}
                                label={Languages.common.cancel}
                                style={styles.btn}
                            />
                            <Button
                                onPress={onSuccessPress}
                                label={Languages.common.agree}
                                buttonStyle={BUTTON_STYLES.RED}
                                style={styles.btn}
                            />
                        </View> : null
                    }

                </View>
            </Modal>
        );
    });

export default PopupStatus;

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
        flexDirection: 'row'
    },
    btn: {
        width: SCREEN_WIDTH / 2 - Configs.IconSize.size40,
        marginTop: 10,
        marginHorizontal: 5
    }
});
