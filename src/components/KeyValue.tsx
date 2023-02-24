import React from 'react';
import {
    StyleSheet, Text, View, ViewStyle
} from 'react-native';

import { Configs } from '@/commons/Configs';
import { Styles } from '@/theme';

const KeyValue = ({ style, label, value, color, unit }:
     { style: ViewStyle, label: string, value: string, color: string, unit?: string }) => {

    return (
        <View style={style}>
            <Text style={styles.key}>
                {label}
            </Text>
            <View style={styles.row}>
                <Text style={[styles.smallMoney, { color }]}>
                    {value}
                </Text>
                {unit && <Text style={[styles.unit, { color }]}>
                    {unit}
                </Text>}
            </View>
        </View>
    );
};

export default KeyValue;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end'
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
    }
});
