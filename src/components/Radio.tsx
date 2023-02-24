
import React from 'react';
import {
    StyleSheet, View, Text
} from 'react-native';

import { COLORS } from '@/theme/colors';
import { Touchable } from './elements/touchable';
import { Styles } from '@/theme';


const Radio = ({ label, onPress, isEnable, value, isRightIcon } :
     { label: string, onPress?: any, isEnable?: boolean, value: boolean, isRightIcon?: boolean }) => {

    const btn = <View
        style={[styles.radio, { borderColor: value ? COLORS.RED : COLORS.GRAY_11 }]}>
        {
            value && <View style={styles.radioActive} />
        }
    </View>;

    return <Touchable
        style={isRightIcon ? styles.wrapRadioRight : styles.wrapRadio}
        radius={12}
        disabled={!isEnable}
        onPress={onPress}>
        {isRightIcon ? <>
            <Text style={styles.labelRight}>{label}</Text>
            {btn}
        </> : <>
            {btn}
            <Text style={styles.label}>{label}</Text>
        </>}

    </Touchable>;
};

export default Radio;

const styles = StyleSheet.create({
    wrapRadio: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
        paddingVertical: 3
    },
    wrapRadioRight: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        justifyContent: 'space-between'
    },
    radio: {
        height: 20,
        width: 20,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    radioActive: {
        height: 10,
        width: 10,
        borderRadius: 6,
        backgroundColor: COLORS.RED
    },
    label: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        paddingLeft: 5
    },
    labelRight: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6
    }
});
