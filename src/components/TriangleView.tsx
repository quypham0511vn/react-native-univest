
import React from 'react';
import {
    StyleSheet, View
} from 'react-native';

import { COLORS } from '@/theme/colors';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';


const TriangleView = () =>
    <View style={styles.triangle}>
        <View style={styles.triangleLeft} />
        <View style={styles.triangleRight} />
    </View>;

const styles = StyleSheet.create({
    triangle: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    triangleLeft: {
        width: 0,
        height: 0,
        backgroundColor: COLORS.TRANSPARENT,
        borderRightWidth: SCREEN_WIDTH / 2,
        borderBottomWidth: 120,
        borderRightColor: COLORS.TRANSPARENT,
        borderBottomColor: COLORS.RED,
        borderLeftColor: COLORS.TRANSPARENT
    },
    triangleRight: {
        width: 0,
        height: 0,
        backgroundColor: COLORS.TRANSPARENT,
        borderLeftWidth: SCREEN_WIDTH / 2,
        borderBottomWidth: 120,
        borderRightColor: COLORS.TRANSPARENT,
        borderBottomColor: COLORS.RED,
        borderLeftColor: COLORS.TRANSPARENT
    }
});

export default TriangleView;
