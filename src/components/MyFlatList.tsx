import React from 'react';
import {
    FlatList,
    FlatListProps,
    RefreshControl
} from 'react-native';

import { COLORS } from '@/theme';

const MyFlatList = ({ ...props }: FlatListProps<any>) =>
    <FlatList
        {...props}
        refreshControl={<RefreshControl
            tintColor={COLORS.RED}
            colors={[COLORS.RED, COLORS.GREEN, COLORS.GRAY_1]}
            refreshing={props?.refreshing || false}
            onRefresh={props?.onRefresh || undefined}
        />}
    />;

export default MyFlatList;
