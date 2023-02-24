import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { COLORS, Styles } from '@/theme';
import { PopupActions, PopupProps } from './types';

const PopupNoInternet = forwardRef<PopupActions, PopupProps>(
    ({
        onClose
    }: PopupProps, ref) => {
        const [visible, setVisible] = useState<boolean>(false);
        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide
        }));

        const _onClose = useCallback(() => {
            hide();
            onClose?.();
        }, [hide, onClose]);

        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>
                    <Text style={styles.txtTitle}>{Languages.noInternet.offline}</Text>
                    <Text
                        style={styles.txtContent}
                    >
                        {Languages.noInternet.desNoInternet}
                    </Text>
                </View>
            </Modal>
        );
    });

export default PopupNoInternet;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ic: {
        marginTop: 10,
        marginBottom: -10,
        width: Configs.IconSize.size39,
        height: Configs.IconSize.size39
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginTop: 20
    },
    txtContent: {
        ...Styles.typography.regular,
        marginVertical: 10,
        marginHorizontal: 10,
        textAlign: 'center'
    },
    btn: {
        width: '50%',
        marginTop: 10
    }
});
