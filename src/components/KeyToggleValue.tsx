import React from 'react';
import {
    StyleSheet, Switch, Text, View
} from 'react-native';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';

const KeyToggleValue = ({ label, isEnabled, onToggleSwitch }:
    { label: string, isEnabled: boolean, onToggleSwitch: () => any }) => {

    return (
        <View>
            <View style={styles.row}>
                <Text style={styles.key}>
                    {label}
                </Text>
                <Switch
                    style={styles.switch}
                    trackColor={{ true: COLORS.RED }}
                    thumbColor={isEnabled ? COLORS.WHITE : ''}
                    ios_backgroundColor={COLORS.BLACK}
                    onValueChange={onToggleSwitch}
                    value={isEnabled}
                />
            </View>
            <Dash
                style={styles.dash}
                dashThickness={1}
                dashLength={10}
                dashGap={5}
                dashColor={COLORS.GRAY_1} />
        </View>
    );
};

export default KeyToggleValue;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginTop: 5    ,
        marginLeft: 10,
        flex: 1,
        paddingBottom: 5
    },
    key: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6
    },
    switch: {
        transform: [
            { scaleX: .7 },
            { scaleY: .7 }
        ]
    },
    dash: {
        marginRight: 8
    }
});
