import React from 'react';
import {
    RefreshControl
} from 'react-native';

import { COLORS } from '../theme';

const MyRefreshControl = ({ isRefreshing, onRefresh }: { isRefreshing: boolean, onRefresh: () => any }) =>
    <RefreshControl
        tintColor={COLORS.GREEN}
        colors={[COLORS.GREEN, COLORS.RED, COLORS.GRAY_1]}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
    />;

export default MyRefreshControl;
