import React from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';

import ImgNoData from '@/assets/images/img_no_data.svg';
import { COLORS, Styles } from '@/theme';

const NoData = ({ description, hasImage = true }: { description: string, hasImage?: boolean }) => {
    return <View style={styles.content}>
        {hasImage && <ImgNoData />}
        <Text style={styles.description}>
            {description}
        </Text>
    </View>;
};

export default NoData;

const styles = StyleSheet.create({
    content: {
        paddingVertical: 50,
        alignItems: 'center'
    },
    description: {
        ...Styles.typography.medium,
        color: COLORS.RED,
        paddingVertical: 6,
        paddingHorizontal: 15,
        alignSelf: 'center'
    }
});
