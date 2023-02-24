import React, {
    forwardRef,
    useCallback, useImperativeHandle, useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { COLORS, Styles } from '@/theme';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Touchable } from '.';
import Utils from '@/utils/Utils';
import { PopupActions } from './popup/types';
import { ENUM_BIOMETRIC_TYPE } from '@/commons/constants';


type PopupProps = {
    onClose?: () => any;
    onConfirm?: () => any;
    onBackdropPress?: () => any;
    content?: string;
    btnText?: string;
    title?: string;
    errorType?: string
};



const PopupErrorBiometry = forwardRef<PopupActions, PopupProps>(
    ({ onClose, title, errorType }: PopupProps, ref) => {
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

        const _openSetting = useCallback(() => {
            _onClose();
            Utils.openSetting();
        }, [_onClose]);

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
                    <Text style={styles.txtTitle}>Xác thực nhanh của bạn</Text>
                    <Text style={styles.txtContent}>
                        {errorType === ENUM_BIOMETRIC_TYPE.FACE_ID ? 
                            Languages.quickAuThen.desSetFaceId : 
                            Languages.quickAuThen.desSetTouchId}
                    </Text>
                    <Touchable onPress={_openSetting} style={styles.setting}>
                        <Text style={styles.txtSetting}>{Languages.quickAuThen.goToSetting}</Text>
                    </Touchable>
                </View>
            </Modal>
        );
    }
);

export default PopupErrorBiometry;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingTop: 10,
        paddingRight: 15
    },
    ic: {
        marginTop: 10,
        marginBottom: -10,
        width: Configs.IconSize.size39,
        height: Configs.IconSize.size39
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size15,
        color: COLORS.BLACK_PRIMARY,
        fontWeight: 'bold'
    },
    txtContent: {
        ...Styles.typography.regular,
        marginVertical: 10,
        marginRight: 20,
        color: COLORS.BLACK_PRIMARY,
        fontSize: Configs.FontSize.size13
    },
    btn: {
        width: '50%',
        marginTop: 10
    },
    iconFinger: {
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: 20
    },
    description: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    iconClose: {
        alignItems: 'flex-end'
    },
    setting: {
        alignSelf: 'flex-end',
        marginRight: 10
    },
    txtSetting: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16
    }
});
