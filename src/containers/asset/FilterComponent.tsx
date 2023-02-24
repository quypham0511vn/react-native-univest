import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { Periods } from '@/commons/constants';
import FilterTemplate from '@/components/FilterTemplate';
import { KeyValueModel } from '@/models/key-value';
import SessionManager from '@/managers/SessionManager';
import { COLORS } from '@/theme';

const FilterComponent = ({ onFilterChanged, needRefresh }: { onFilterChanged: () => any, needRefresh: boolean }) => {
    const [selectedFilter, setSelectedFilter] = useState<number>(SessionManager.currentFilter);
    const flatListRef = useRef<FlatList>();

    useEffect(()=>{
        setSelectedFilter(SessionManager.currentFilter);
    }, [needRefresh]);

    const renderFilterTemplate = useCallback(({ item, index }: { item: KeyValueModel, index: number }) => {
        let selected = false;
        if (item.value === selectedFilter) {
            selected = true;
        }

        const _onPress = () => {
            setSelectedFilter(item.value);
            SessionManager.currentFilter = item.value;
            onFilterChanged?.();
            flatListRef.current?.scrollToIndex({ animated: false, index });
        };

        return <FilterTemplate
            item={item}
            onPress={_onPress}
            selected={selected}
        />;
    }, [onFilterChanged, selectedFilter]);

    const keyExtractor = useCallback((item: KeyValueModel) => {
        return `${item.value}`;
    }, []);

    const renderFilter = useMemo(() => {
        return <FlatList
            ref={flatListRef}
            data={Periods}
            renderItem={renderFilterTemplate}
            horizontal
            showsHorizontalScrollIndicator={false}
            {...{ keyExtractor }}
        />;
    }, [keyExtractor, renderFilterTemplate]);

    return <View style={styles.filter}>
        {renderFilter}
    </View>;
};

export default FilterComponent;

const styles = StyleSheet.create({
    filter: {
        marginTop: 20,
        paddingVertical: 5,
        borderRadius: 6,
        backgroundColor: COLORS.GRAY_13
    }
});
