import React, { useCallback } from 'react';
import {  View, StyleSheet, Text } from 'react-native';
import { observer } from 'mobx-react';

import ImgHeader from '@/assets/images/img_logo_header.svg';
import Languages from '@/commons/Languages';
import { Configs, HEADER_PADDING, PADDING_TOP, STATUSBAR_HEIGHT } from '@/commons/Configs';
import { COLORS, IconSize, Styles } from '@/theme';
import IcClose from '@/assets/images/ic_close.svg';
import { Touchable } from '../elements/touchable';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';

const HeaderAccount = observer(({ onClose }: {onClose?: boolean}) => {

    const onNavigateLogin = useCallback(() => {
        Navigator.navigateToDeepScreen([Languages.tabs.product], ScreenNames.product);
    },[]);

    return (
        <View style={styles.header}>
            {onClose && <Touchable style={styles.iconClose} onPress={onNavigateLogin}>
                <IcClose  {...IconSize.size40_40} />
            </Touchable> }
            <View style={styles.view}>
                <ImgHeader />  
                <Text style={styles.slogan}>{Languages.slogan.title}</Text>
            </View>
        </View>
    );
});

export default HeaderAccount;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    view: {
        justifyContent: 'center',
        marginTop: STATUSBAR_HEIGHT + HEADER_PADDING,
        marginBottom: PADDING_TOP + STATUSBAR_HEIGHT
    },
    slogan:{
        ...Styles.typography.bold,
        color: COLORS.RED,
        textAlign: 'center',
        marginTop: Configs.IconSize.size10
    },
    iconClose:{
        position: 'absolute',
        top: STATUSBAR_HEIGHT + PADDING_TOP,
        left: 0
    }
});
