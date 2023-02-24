import React, { useCallback } from 'react';
import {
    Text, View, StyleSheet
} from 'react-native';

import { Configs, HEADER_PADDING } from '@/commons/Configs';
import { COLORS } from '@/theme';
import Languages from '@/commons/Languages';
import { Touchable } from './elements/touchable';
import Navigator from '@/routers/Navigator';
import IconArrowLeft from '@/assets/images/ic_left_arrow.svg';
import ScreenNames from '@/commons/ScreenNames';

const Back = () => {

    const onNavigateHome = useCallback(() => {
        Navigator.navigateToDeepScreen([Languages.tabs.product], ScreenNames.product);
    }, []);

    return (
        <View style={styles.back}>
            <Touchable onPress={onNavigateHome} style={styles.checkbox}>
                <View style={styles.wrapIconBack}>
                    <IconArrowLeft />
                </View>
                <Text style={styles.txtForgotPwd}>
                    {Languages.common.back}
                </Text>
            </Touchable>
        </View>
    );
};

export default Back;
const styles = StyleSheet.create({
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    back: {
        alignItems: 'center',
        marginTop: Configs.heightHeader,
        marginBottom: HEADER_PADDING
    },
    txtForgotPwd: {
        color: COLORS.RED,
        fontFamily: Configs.FontFamily.regular,
        fontSize: Configs.FontSize.size14
    },
    wrapIconBack: {
        width: 24,
        borderWidth: 1,
        borderColor: COLORS.RED,
        height: 24,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.SOFT_RED,
        marginRight: 8
    }
});
