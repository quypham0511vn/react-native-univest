import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useMemo,
    useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '.';
import { ENUM_BIOMETRIC_TYPE } from './popupFingerprint/types';
import FaceIdIcon from '@/assets/images/ic_faceId_active.svg';
import TouchIdIcon from '@/assets/images/ic_touchId_active.svg';
import PinIcon from '@/assets/images/ic_pin_active.svg';

export type PopupProps = {
  onClose?: () => any;
  onConfirm?: () => any;
  onBackdropPress?: () => any;
  content?: string;
  btnText?: string;
  icon?: any;
  typePopup?: string;
};

export type PopupConfirmAction = {
  show: (content?: string) => any;
  hide?: (content?: string) => any;
  setContent?: (message: string) => void;
};

const PopupVerifyRequest = forwardRef<PopupConfirmAction, PopupProps>(
    ({ onClose, icon, content, onConfirm, typePopup }: PopupProps, ref) => {
        const [visible, setVisible] = useState<boolean>(false);
        console.log(typePopup);
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

        const _onConfirm = useCallback(() => {
            onConfirm?.();
        }, [onConfirm]);

        const renderContent = useMemo(() => {
            switch (typePopup) {
                case ENUM_BIOMETRIC_TYPE.FACE_ID:
                    return (
                        <View style={styles.center}>
                            <FaceIdIcon/>
                            <Text style={styles.txtConfirm}>{Languages.quickAuThen.confirm}</Text>
                            <Text style={styles.txtContent}>{Languages.quickAuThen.facIdConFirm}</Text>
                        </View>
                    );
                case ENUM_BIOMETRIC_TYPE.TOUCH_ID:
                    return (
                        <View style={styles.center}>
                            <TouchIdIcon/>
                            <Text style={styles.txtConfirm}>{Languages.quickAuThen.confirm}</Text>
                            <Text style={styles.txtContent}>{Languages.quickAuThen.touchIdConfirm}</Text>
                        </View>
                    );
                case ENUM_BIOMETRIC_TYPE.KEY_PIN:
                    return (
                        <View style={styles.center}>
                            <PinIcon/>
                            <Text style={styles.txtConfirm}>{Languages.quickAuThen.confirm}</Text>
                            <Text style={styles.txtContent}>{Languages.quickAuThen.passcodeConfirm}</Text>
                        </View>
                    );
                default:
                    return null;
            }
        }, [typePopup]);
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
                    {renderContent}
                    <View style={styles.wrapButton}>
                        <Touchable onPress={_onClose} style={styles.cancelButton}>
                            <Text style={styles.txtCancel}>{Languages.common.cancel}</Text>
                        </Touchable>
                        <Touchable onPress={_onConfirm} style={styles.confirmButton}>
                            <Text style={styles.txtVerify}>{Languages.common.agree}</Text>
                        </Touchable>
                    </View>
                </View>
            </Modal>
        );
    }
);

export default PopupVerifyRequest;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        paddingHorizontal: 20,
        marginHorizontal:10,
        paddingBottom:15
    },
    ic: {
        marginTop: 10,
        marginBottom: -10,
        width: Configs.IconSize.size39,
        height: Configs.IconSize.size39
    },
    txtTitle: {
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.regular,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginTop: 20
    },
    txtConfirm: {
        ...Styles.typography.medium,
        marginVertical: 10,
        marginHorizontal: 10,
        textAlign: 'center',
        color:COLORS.BLACK_PRIMARY
    },
    btn: {
        width: '50%',
        marginTop: 10
    },
    txtContent: {
        ...Styles.typography.medium,
        textAlign: 'center',
        marginBottom:5,
        color:COLORS.GRAY_6
    },
    wrapButton: {
        flexDirection: 'row',
        // width: SCREEN_WIDTH - 90,
        marginTop: 10
    // backgroundColor:COLORS.RED
    },
    cancelButton: {
        width: (SCREEN_WIDTH - 95) / 2,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderWidth:1,
        borderColor:COLORS.RED
    },
    confirmButton: {
        width: (SCREEN_WIDTH - 110) / 2,
        backgroundColor: COLORS.RED,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginLeft: 15
    },
    txtVerify: {
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size14
    },
    txtCancel: {
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size14
    },
    center:{
        alignItems:'center'
    }
});
