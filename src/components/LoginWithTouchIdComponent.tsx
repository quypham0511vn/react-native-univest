import React, { useCallback, useMemo, useState } from 'react';
import {
    StyleSheet,
    Text, View
} from 'react-native';

import CheckIcon from '@/assets/images/ic_check.svg';
import IcFingerprint from '@/assets/images/ic_fingerprint_active.svg';
import TakePicIcon from '@/assets/images/ic_takePic.svg';
import UnCheckIcon from '@/assets/images/ic_uncheck.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { SCREEN_HEIGHT } from '@/utils/DimensionUtils';
import { Touchable } from '.';
import { COLORS, Styles } from '../theme';
import { MyTextInput } from './elements/textfield';


const HORIZONTAL_PADDING = 16;
const CONTENT_HEIGHT = Math.min(320, SCREEN_HEIGHT / 2.2);
const LoginWithTouchIdComponent = ()=>{
    const [checked, setCheck] = useState<boolean>(true);

    const onChangeChecked = useCallback(() => {
        setCheck(!checked);
    }, [checked]);

    const checkbox = useMemo(() => {
        if (checked) {
            return <CheckIcon width={20} height={20} />;
        }
        return <UnCheckIcon width={20} height={20} />;
    }, [checked]);

    return <View style={styles.top}>
        <View style={styles.wrapAvatar}>
            <Touchable style={styles.circle}>
                <TakePicIcon width={20} height={20}/>
            </Touchable>
        </View>
        <View style={styles.row}>
            <Text style={styles.txtHello}>{Languages.account.hello}</Text>
            <Text style={styles.txtName}>ĐINH TRƯỜNG GIANG</Text>
        </View>
        <MyTextInput
            placeHolder={Languages.auth.pwd}
            isPassword
            maxLength={50} />

        <View style={styles.checkboxContainer}>
            <Touchable
                style={styles.checkbox}
                onPress={onChangeChecked}
            >
                {checkbox}
            </Touchable>
            <Text style={styles.txtSave}>
                {Languages.auth.saveInfo}
            </Text>
        </View>
        <View style={styles.buttonContainer}>
            <Touchable style={styles.button}>
                <Text style={styles.txtBt}>{Languages.auth.login}</Text>
            </Touchable>
            <View style={styles.wrapIcon}>
                <IcFingerprint/>
            </View>
        </View>
   
    </View>;
};
export default LoginWithTouchIdComponent;
const styles = StyleSheet.create({
    top: {
        flex: 1,
        backgroundColor: COLORS.WHITE,
        height: CONTENT_HEIGHT,
        paddingHorizontal: HORIZONTAL_PADDING,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        justifyContent: 'space-between',
        zIndex: 9999
    },
    checkboxContainer: {
        flexDirection: 'row',
        marginVertical: 20
    },
    checkbox: {
    },
    txtSave: {
        fontFamily: Configs.FontFamily.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size14,
        marginLeft: 5
    },
    wrapAvatar: {
        width: 80,
        height:80,
        borderRadius: 45,
        borderWidth: 3,
        borderColor: COLORS.RED,
        alignSelf: 'center',
        marginTop: 20
    },
    txtName: {
        fontSize: Configs.FontSize.size16,
        fontFamily: Configs.FontFamily.bold,
        color: COLORS.RED_4,
        marginLeft: 4
    },
    txtHello: {
        fontSize: Configs.FontSize.size14,
        fontFamily: Configs.FontFamily.bold,
        color: COLORS.GRAY_11,
        marginBottom: 2
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        alignSelf: 'center',
        marginTop: 10
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 20,
        backgroundColor: COLORS.WHITE,
        position: 'absolute',
        bottom: 0,
        right: -8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button:{
        width:'85%',
        backgroundColor:COLORS.RED,
        paddingVertical:10,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5
    },
    txtBt:{
        ...Styles.typography.medium,
        color:COLORS.WHITE
    },
    buttonContainer:{
        flexDirection:'row',
        alignItems:'center'
    },
    wrapIcon:{
        width:36,
        borderWidth:1,
        borderColor:COLORS.RED,
        height:36,
        borderRadius:18,
        marginLeft:10,
        justifyContent:'center',
        alignItems:'center'
    },
    
});
