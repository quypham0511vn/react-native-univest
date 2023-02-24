import React from 'react';
import {
    StyleSheet, Text, View, ViewStyle
} from 'react-native';

import { Configs } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';
import Languages from '@/commons/Languages';

const KeyValueAsset = ({ style, label, value, color }:
     { style?: ViewStyle, label: string, value: string, color: string}) => {

    return (
        <View style={style}>
            <Text style={styles.key}>
                {label}
            </Text>
            <View style={styles.row}>
                <Text style={[styles.smallMoney, { color }]}>
                    {value}
                </Text>
                <Text style={styles.unit}>
                    {Languages.common.currency}
                </Text>
            </View>
        </View>
    );
};

export default KeyValueAsset;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    key: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6
    },
    smallMoney: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16
    },
    unit: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        margin: 2
    }
});
