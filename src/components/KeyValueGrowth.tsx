import React from 'react';
import {
    StyleSheet, Text, View, ViewStyle
} from 'react-native';

import { Configs } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';
import Languages from '@/commons/Languages';
import IcUp from '@/assets/images/ic_growth_up.svg';
import IcDown from '@/assets/images/ic_growth_down.svg';
import Utils from '@/utils/Utils';

const KeyValueGrowth = ({ style, value, color, rate }:
    { style: ViewStyle, value?: string, color?: string, rate?: string }) => {

    const isUp = !value?.includes('-');
    const money = Utils.formatMoney(value);

    const sign = Number(money) === 0 ? '' : (isUp ? '+' : '');
    const _color = Number(money) === 0 ? COLORS.BLACK : color;

    return (
        <View style={style}>
            <Text style={styles.key}>
                {Languages.assets.assetCardFields[3]}
            </Text>
            <View style={styles.row}>
                {isUp ? <IcUp /> : <IcDown />}
                <Text style={[styles.smallMoney, { color: _color }]}>
                    {rate}
                </Text>

                <View style={styles.marginLeft} />

                <Text style={[styles.smallMoney, { color: _color }]}>
                    {`${sign}${money}`}
                </Text>
                <Text style={[styles.unit, { color: _color }]}>
                    {Languages.common.currency}
                </Text>
            </View>
        </View>
    );
};

export default KeyValueGrowth;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    key: {
        ...Styles.typography.regular
    },
    smallMoney: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16
    },
    unit: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        margin: 2
    },
    marginLeft: {
        marginLeft: 20
    }
});
