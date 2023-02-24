import React, {
    forwardRef,
    useCallback,
    useImperativeHandle,
    useState
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';

import ImgLogo from '@/assets/images/img_logo_header.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Touchable } from '.';
import { PopupActions } from './popup/types';

export interface PopupVerifyRequestProps {
    icon?: any;
    showBtn?: boolean;
}
export type PopupProps = {
    onClose?: () => any;
    onConfirm?: () => any;
    onBackdropPress?: () => any;
    content?: string;
    btnText?: string;
    type?: string;
    title?: string;
    showBtn?: boolean;
    icon?: any
};
const PopupMaintain = forwardRef<PopupActions, PopupProps>(
    ({ onClose, icon, content, onConfirm, title, showBtn = true }: PopupProps, ref) => {
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

        const _onConfirm = useCallback(() => {
            onConfirm?.();
        }, [onConfirm]);
        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>
                    <ImgLogo width={SCREEN_WIDTH / 3} />
                    <Text style={styles.txtTitle}>
                        {Languages.maintain.title}
                    </Text>
                    <Text style={styles.txtContent}>{Languages.maintain.description}</Text>
                    {showBtn && <View style={styles.wrapButton}>
                        <Touchable onPress={_onConfirm} style={styles.confirmButton}>
                            <Text style={styles.txtVerify}>{Languages.maintain.update.toUpperCase()}</Text>
                        </Touchable>
                    </View>}
                </View>
            </Modal>
        );
    }
);

export default PopupMaintain;

const styles = StyleSheet.create({
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 6,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        marginBottom: 20,
        marginHorizontal: 10,
        textAlign: 'center',
        marginTop: 10
    },
    btn: {
        width: '50%',
        marginTop: 10
    },
    txtContent: {
        ...Styles.typography.regular,
    },
    wrapButton: {
        flexDirection: 'row',
        width: SCREEN_WIDTH,
        marginTop: 30,
        justifyContent:'center'
    },
    cancelButton: {
        width: (SCREEN_WIDTH - 90) / 2,
        backgroundColor: COLORS.GRAY,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    confirmButton: {
        width: (SCREEN_WIDTH - 110) / 2,
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
