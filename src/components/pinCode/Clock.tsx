import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';

import { COLORS } from '@/theme';
import { DEFAULT } from './types';


const Clock = ({
    duration = DEFAULT.Options.lockDuration,
    style,
    textStyle,
    onFinish
}: {
  duration?: number;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  onFinish: () => void;
}) => {
    const [countDown, setCountDown] = useState(duration);

    useEffect(() => {
        setTimeout(() => {
            if (countDown > 1000) {
                setCountDown(countDown - 1000);
            } else {
                onFinish();
            }
        }, 1000);
    });

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.time, textStyle]}>
                {millisToMinutesAndSeconds(countDown)}
            </Text>
        </View>
    );
};

export function millisToMinutesAndSeconds(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderColor: COLORS.WHITE
    },
    time: { fontSize: 20, color: COLORS.WHITE }
});

export default Clock;
