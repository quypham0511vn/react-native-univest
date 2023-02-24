import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutAnimation, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Dash from 'react-native-dash';
import { useIsFocused } from '@react-navigation/native';

import IcCollapse from '@/assets/images/ic_collapse.svg';
import IcShowMore from '@/assets/images/ic_show_more.svg';
import Languages from '@/commons/Languages';
import KeyValue from '@/components/KeyValue';
import KeyValueGrowth from '@/components/KeyValueGrowth';
import { AssetsModelData } from '@/models/assets';
import { COLORS, IconSize, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import { isIOS } from '@/commons/Configs';
import { PopupActions } from '@/components/popup/types';
import PopupFilter from './PopupFilter';
import SessionManager from '@/managers/SessionManager';
import IcArrow from '@/assets/images/ic_arrow_right_gray.svg';
import { Periods } from '@/commons/constants';
import DateUtils from '@/utils/DateUtils';
import { Touchable } from '@/components';
import IcFilter from '@/assets/images/ic_filter.svg';

const AssetDetailComponent = ({ data, isCard, isUnlimited, onFilterChanged }:
    { data?: AssetsModelData, isCard?: boolean, isUnlimited?: boolean, onFilterChanged: () => any }) => {

    const [showGrowth, setShowGrowth] = useState<boolean>(true);
    const [toggleFilter, setToggleFilter] = useState<boolean>(false);
    const popupFilter = useRef<PopupActions>();
    const isFocused = useIsFocused();

    useEffect(() => {
        if (!isFocused) {
            setShowGrowth(true);
        }
    }, [isFocused]);

    const openFilter = useCallback(() => {
        popupFilter.current?.show();
    }, []);

    const updateFilter = useCallback(() => {
        setToggleFilter(last => !last);
    }, []);


    const onToggle = useCallback(() => {
        setShowGrowth(last => !last);
        if (isIOS) {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }
    }, []);

    const renderCardSection = useCallback((label: string, value: any, color?: any) => {
        return <KeyValue
            style={styles.cardSection}
            unit={Languages.common.currency}
            {...{ label, value, color }} />;
    }, []);

    const renderFilter = useMemo(() => {
        let dateFiltering = '';
        let dateString = '';

        if (SessionManager.currentFilter !== -1) {
            dateFiltering = Periods.filter(item => item.value === SessionManager.currentFilter)?.[0].label || '';
        }

        if (SessionManager.currentFilter === 0) {
            dateString = `${dateFiltering} ${Languages.assets.toPresent}`;
        } else if (SessionManager.currentFilter > 0) {
            dateString = `${dateFiltering} ${Languages.assets.recent}`;
        }
        return <View style={styles.filter}>
            <View style={styles.row}>
                <Text style={styles.title}>
                    {Languages.assets.reportPeriod}
                </Text>

                {dateFiltering ? <>
                    <Text style={styles.dateTxt}>
                        {dateString}
                    </Text>
                </> : <>
                    <Text style={styles.dateTxt}>
                        {SessionManager.currentFilterStartDate
                            ? DateUtils.getDateFromClient(SessionManager.currentFilterStartDate)
                            : Languages.assets.filter[0]}
                    </Text>
                    <IcArrow {...IconSize.size25_25} />
                    <Text style={styles.dateTxt}>
                        {SessionManager.currentFilterEndDate
                            ? DateUtils.getDateFromClient(SessionManager.currentFilterEndDate)
                            : Languages.assets.toPresent}
                    </Text>
                </>}
            </View>
            {/* <Touchable style={styles.rightIcon} onPress={openFilter}
                size={40}>
                <IcFilter {...IconSize.size25_25} />
            </Touchable> */}
        </View>;
    }, [openFilter]);

    const _onFilterChanged = useCallback(() => {
        onFilterChanged?.();
        updateFilter();
    }, []);

    const renderGrowthDetails = useMemo(() => {
        return <>

            {!showGrowth && <>
                <Dash
                    style={styles.dash2}
                    dashThickness={1}
                    dashLength={10}
                    dashGap={5}
                    dashColor={COLORS.GRAY_7} />
                {renderFilter}
                {renderCardSection(Languages.assets.assetCardFields[0], Utils.formatMoney(data?.beginning_asset))}
                {renderCardSection(Languages.assets.assetCardFields[1], Utils.formatMoney(data?.pay_in, true))}
                {renderCardSection(Languages.assets.assetCardFields[2], Utils.formatMoney(data?.pay_out))}
            </>}

            <KeyValueGrowth
                style={styles.cardSection}
                color={data?.color_growth}
                value={data?.growth}
                rate={data?.rate} />

            {!showGrowth && renderCardSection(Languages.assets.assetCardFields[4], Utils.formatMoney(data?.end_asset))}

            <TouchableOpacity onPress={onToggle}
                style={styles.row}>
                <Text style={showGrowth ? styles.growthOn : styles.growthOff}>
                    {showGrowth ? Languages.assets.growthOn : Languages.assets.growthOff}
                </Text>
                {showGrowth ? <IcShowMore /> : <IcCollapse />}
            </TouchableOpacity>

            <PopupFilter
                ref={popupFilter}
                onConfirm={_onFilterChanged}
                onClose={_onFilterChanged} />

        </>;
    }, [_onFilterChanged, data, onToggle, renderCardSection, renderFilter, showGrowth]);

    return renderGrowthDetails;
};

export default AssetDetailComponent;

const styles = StyleSheet.create({
    cardSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3
    },
    growthOn: {
        ...Styles.typography.regular,
        color: COLORS.RED_3,
        textAlign: 'center',
        paddingVertical: 5
    },
    growthOff: {
        ...Styles.typography.regular,
        textAlign: 'center',
        paddingVertical: 5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 5
    },
    rightIcon: {
        paddingHorizontal: 5,
        justifyContent: 'center'
    },
    filter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: -10
    },
    dateTxt: {
        ...Styles.typography.regular
    },
    title: {
        ...Styles.typography.bold,
        textAlign: 'center',
        marginRight: 15
    },
    dash2: {
        marginTop: 5
    }
});
