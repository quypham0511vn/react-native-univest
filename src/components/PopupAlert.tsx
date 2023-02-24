import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable, Button } from '.';
import { PopupActions, PopupProps } from './popup/types';
import IcAlert from '@/assets/images/ic_warning.svg';

export interface PopupAlertProps extends PopupProps {

    type?: string;
    title?: string;
    showBtn?: boolean;
    isTransfer?: boolean;
    icon?: any
};
const PopupAlert = forwardRef<PopupActions, PopupAlertProps>(
    ({ onClose, onConfirm, showBtn = true, isTransfer = false }: PopupAlertProps, ref) => {
        const [visible, setVisible] = useState<boolean>(false);
        const [title, setTitle] = useState<string>('');
        const [content, setContent] = useState<string>('');

        const showAlert = useCallback((_title?: string, _content?: string) => {
            setTitle(_title || '');
            setContent(_content || '');
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
        }, []);

        useImperativeHandle(ref, () => ({
            showAlert,
            hide
        }));

        const _onClose = useCallback(() => {
            hide();
            onClose?.();
        }, [hide, onClose]);

        const _onConfirm = useCallback(() => {
            onConfirm?.();
        }, [onConfirm]);
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
                    <IcAlert width={40} height={40} />
                    {title && <Text style={styles.txtTitle}>
                        {title}
                    </Text>}
                    <Text style={styles.txtContent}>
                        {content}
                    </Text>
                    {showBtn && <View style={styles.wrapButton}>
                        <Touchable onPress={_onClose} style={styles.cancelButton}>
                            <Text style={styles.txtCancel}>{Languages.common.cancel.toUpperCase()}</Text>
                        </Touchable>
                        <Touchable onPress={_onConfirm} style={styles.confirmButton}>
                            <Text style={styles.txtVerify}>{Languages.common.agree.toUpperCase()}</Text>
                        </Touchable>
                    </View>}

                    {isTransfer && <View style={styles.wrapButton}>
                        <Button
                            onPress={_onClose}
                            style={styles.button}
                            label={Languages.transferScreen.goHome}
                            fontSize={Configs.FontSize.size13}
                            buttonStyle={'PINK'}
                        />
                    </View>}
                </View>
            </Modal>
        );
    }
);

export default PopupAlert;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        width: '90%',
        alignSelf: 'center',
        paddingHorizontal: 20
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size18,
        marginBottom: 20,
        marginHorizontal: 10,
        textAlign: 'center',
        marginTop: 10
    },
    txtContent: {
        ...Styles.typography.regular,
        textAlign: 'center'
    },
    btn: {
        width: '50%',
        marginTop: 10
    },
    button: {
        flex: 1,
        marginTop: 15,
        marginHorizontal: 10
    },
    wrapButton: {
        flexDirection: 'row',
        alignSelf: 'center'
    },
    cancelButton: {
        width: (SCREEN_WIDTH - 130) / 2,
        backgroundColor: COLORS.GRAY,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    confirmButton: {
        width: (SCREEN_WIDTH - 150) / 2,
        backgroundColor: COLORS.RED,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        marginLeft: 15
    },
    txtVerify: {
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14
    },
    txtCancel: {
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size14
    }
});
