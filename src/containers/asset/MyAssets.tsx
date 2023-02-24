import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';

import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import KeyValueAsset from '@/components/KeyValueAsset';
import NoData from '@/components/NoData';
import Period from '@/components/Period';
import { AssetsModelData } from '@/models/assets';
import { ProductModel } from '@/models/product';
import Navigator from '@/routers/Navigator';
import { HtmlStyles, Styles } from '@/theme';
import Utils from '@/utils/Utils';

const MyAssets = observer(({ contracts, products, ...props }:
    { contracts?: AssetsModelData[], products: ProductModel[], props?: any }) => {

    const getInterestByPeriod = useCallback((period: number) => {
        return products.find(item => item.period === period)?.interest || '-';
    }, [products]);

    const renderDetailSection = useCallback((label: string, value: string, color: string) => {
        return <KeyValueAsset
            key={label}
            style={styles.detailContent}
            {...{ label, value, color }} />;
    }, []);

    const renderSection = useCallback((label: string, value: string, color: string, period: number, unit?: string) => {
        return <View style={styles.detailSection}>
            <View>
                <Text style={styles.sectionTxt}>
                    {label}
                </Text>
                <HTMLView
                    stylesheet={HtmlStyles || undefined}
                    value={Languages.assets.periodLabel.replace('%s', getInterestByPeriod(period))}
                />
            </View>
            <View style={styles.rowEnd}>
                <Text style={[styles.smallMoney, { color }]}>
                    {value}
                </Text>
                {unit && <Text style={styles.unit}>
                    {unit}
                </Text>}
            </View>
        </View>;
    }, [getInterestByPeriod]);

    const renderAccumulatedAssets = useCallback((item: AssetsModelData) => {
        const onPress = () => {
            Navigator.pushScreen(ScreenNames.contractDetail, { item });
        };

        return <Touchable
            key={item.id}
            style={styles.sectionContainer}
            onPress={onPress}>
            <View style={styles.row}>
                <Period period={item.period} type={item.type_period} />
                <View style={styles.cardContent}>
                    {renderSection(item.name, Utils.formatMoney(item?.total_money_all), item?.color_total_money_all, item.period, Languages.common.currency)}
                    {/* {renderDetailSection(Languages.assets.receivedInterest, Utils.formatMoney(item?.interest_received), item?.color_interest_received)}
                    {renderDetailSection(Languages.assets.receivedTemp, Utils.formatMoney(item?.provisional_interest), item?.color_provisional_interest)} */}
                </View>
            </View>
        </Touchable>;
    }, [renderSection]);

    return (
        <View style={styles.container}>
            {(contracts?.length === 0) ? <NoData description={Languages.assets.noBook} />
                : contracts?.map((item: AssetsModelData) => renderAccumulatedAssets(item))}
        </View>
    );
});

export default MyAssets;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    sectionContainer: {
        ...Styles.shadow,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 10
    },
    detailSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    detailContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 3
    },
    sectionTxt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16
    },
    sectionSmallTxt: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12
    },
    smallMoney: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size20
    },
    unit: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        margin: 3
    },
    row: {
        flexDirection: 'row'
    },
    rowEnd: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    cardContent: {
        flex: 1,
        marginLeft: 10
    }
});
