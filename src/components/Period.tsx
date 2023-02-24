import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

import IcUnlimited from '@/assets/images/ic_unlimited.svg';
import IcPeriod from '@/assets/images/ic_period.svg';
import IcPigDollar from '@/assets/images/ic_pig_dollar.svg';
import { COLORS, Styles } from '@/theme';
import { Configs } from '@/commons/Configs';

const Period = ({ id, period, type }: { id : number, period: number, type?: number }) => {

    const suffix = type === 1 ? 'D' : 'M';

    return id === 3 ? <IcUnlimited width={35} height={35} /> : (type !== 0 ? (
        <View style={styles.txtIconContainer}>
            <IcPeriod width={35} height={35} style={styles.icPeriod} />
            <Text style={styles.txtIcon}>
                {`${period}${suffix}`}
            </Text>
        </View>
    ):
        (
            <IcPigDollar width={35} height={35}/>
        ));
};

export default Period;

const styles = StyleSheet.create({
    icPeriod: {
        position: 'absolute',
        top: 0,
        left: 0
    },
    txtIconContainer: {
        width: 35,
        height: 35,
        justifyContent: 'center'
    },
    txtIcon: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size11,
        color: COLORS.RED,
        marginTop: 2,
        textAlign: 'center'
    }
});
