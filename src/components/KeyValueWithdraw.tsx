import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
import Dash from 'react-native-dash';

import { Configs } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';
import Languages from '@/commons/Languages';

const KeyValueWithdraw = ({ label, value, color, hasUnit }:
    { label: string, value: string, color?: any, hasUnit?: boolean }) => {

    return (
        <View>
            <View style={styles.row}>
                <Text style={styles.key}>
                    {label}
                </Text>
                <View style={styles.rowEnd}>
                    <Text style={[hasUnit ? styles.color : styles.smallMoney, { color }]}>
                        {value}
                    </Text>
                    {hasUnit && <Text style={styles.unit}>
                        {Languages.common.currency}
                    </Text>}
                </View>
            </View>
            <Dash
                dashThickness={1}
                dashLength={10}
                dashGap={6}
                dashColor={COLORS.GRAY_1} />
        </View>
    );
};

export default KeyValueWithdraw;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginTop: 12
    },
    rowEnd: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingBottom: 5
    },
    key: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6
    },
    smallMoney: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        color: COLORS.BLACK
    },
    unit: {
        ...Styles.typography.medium,
        marginLeft: 3,
        marginTop: 5
    },
    color: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size20,
        color: COLORS.RED_6
    }
});
