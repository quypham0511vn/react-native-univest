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
import { Touchable } from '.';
import PinCodeIcon from '@/assets/images/ic_pin_active.svg';
import { PopupProps } from './popupStatus/types';

interface PopupProp extends PopupProps {
  btnText?: string;
  hasButton?:boolean
};

export type PopupActions = {
  show: (content?: string) => any;
  hide: (content?: string) => any;
  setContent?: (message: string) => void;
  setErrorMsg: (msg?: string) => void;
};

const PopupKYC = forwardRef<PopupActions, PopupProp>(
    ({ onClose, onConfirm, title, content,hasButton}: PopupProp, ref) => {
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
                    <PinCodeIcon/>
                    <Text style={styles.txtTitle}>{title}</Text>
                    <Text style={styles.txtContent}>
                        {content}
                    </Text>
                    {hasButton&& <View style={styles.row}>
                        <Touchable style={styles.closeButton} onPress={_onClose}>
                            <Text style={styles.txtBt}>{Languages.common.cancel}</Text>
                        </Touchable>
                        <Touchable style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.txtBtConfirm}>{Languages.common.agree}</Text>
                        </Touchable>
                    </View>}
                </View>
            </Modal>
        );
    }
);

export default PopupKYC;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        paddingBottom: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        paddingTop: 30
    },
    ic: {
        marginTop: 10,
        marginBottom: -10,
        width: Configs.IconSize.size39,
        height: Configs.IconSize.size39
    },
    txtTitle: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        marginTop: 15
    },
    txtContent: {
        ...Styles.typography.medium,
        marginTop: 10,
        marginHorizontal: 30,
        textAlign: 'center',
        marginBottom:10
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: 10,
        paddingTop: 10
    },
    txtBt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        color: COLORS.RED
    },
    txtBtConfirm: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.WHITE
    },
    closeButton: {
        backgroundColor: COLORS.WHITE,
        borderWidth: 1,
        borderColor: COLORS.RED,
        width: '45%',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 5
    },
    confirmButton: {
        backgroundColor: COLORS.RED,
        borderWidth: 1,
        borderColor: COLORS.RED,
        width: '45%',
        alignItems: 'center',
        paddingVertical: 8,
        borderRadius: 5
    }
});
