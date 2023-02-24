import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
import Dash from 'react-native-dash';

import { Configs } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';
import Languages from '@/commons/Languages';
import { Touchable } from '.';

const KeyValueExpiredTransaction = ({ label1, label2, value1, value2, color, onPress, noIndicator }:
    { label1: string, label2?: string, value1: string, value2: string, color: string, onPress?: () => any, noIndicator?: boolean }) => {

    return (
        <Touchable onPress={onPress}>
            <View style={styles.row}>
                <View style={styles.contentLeft}>
                    <Text style={styles.unit}>
                        {label1}
                    </Text>
                    <Text style={styles.key}>
                        {value1}
                    </Text>
                </View>
                <View style={styles.contentRight}>
                    <Text style={styles.unit}>
                        {label2}
                    </Text>
                    <View style={styles.rowEnd}>
                        <Text style={[styles.smallMoney, { color }]}>
                            {value2}
                        </Text>
                        <Text style={styles.unit}>
                            {Languages.common.currency}
                        </Text>
                    </View>
                </View>
            </View>
            {!noIndicator && <Dash
                style={styles.dash}
                dashThickness={1}
                dashLength={10}
                dashGap={5}
                dashColor={COLORS.GRAY_1} />}

        </Touchable>
    );
};

export default KeyValueExpiredTransaction;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginTop: 12,
        paddingBottom: 5,
        justifyContent: 'space-between'
    },
    rowEnd: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 5
    },
    key: {
        ...Styles.typography.regular,
        marginTop: 5,
    },
    smallMoney: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16
    },
    unit: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
        marginTop: 3,
        marginLeft: 2
    },
    dash: {
        marginRight: 8
    },
    contentLeft: {
        flex: 2
    },
    contentRight: {
        flex: 1
    }
});
