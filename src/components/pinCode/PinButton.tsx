import React from 'react';
import {
    StyleSheet,
    Text,
    TextStyle,
    ViewStyle,
    TouchableOpacity
} from 'react-native';

import { COLORS } from '@/theme';
import { DEFAULT } from './types';

const PinButton = ({
    value,
    style,
    textStyle,
    disabled = false,
    backSpace,
    backSpaceText,
    onPress
}: {
  value: string;
  disabled?: boolean;
  backSpace?: any;
  backSpaceText?: string;
  onPress: (number: string) => void;
  style?: ViewStyle | Array<ViewStyle | undefined>;
  textStyle?: TextStyle | TextStyle[];
}) => {
    if (value === 'delete') {
        return (
            <TouchableOpacity
                disabled={disabled}
                style={[styles.container, style]}
                onPress={() => onPress(value)}
            >
                {backSpace || (
                    <Text style={[styles.number, textStyle]}>
                        {backSpaceText || DEFAULT.TextOptions.enter.backSpace}
                    </Text>
                )}
            </TouchableOpacity>
        );
    }
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                styles.container,
                { backgroundColor: disabled ? COLORS.BACKDROP : COLORS.WHITE },
                style
            ]}
            onPress={() => onPress(value)}
        >
            <Text style={[styles.number, textStyle]}>{value}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.WHITE
    },
    number: { fontSize: 20 }
});

export default PinButton;
