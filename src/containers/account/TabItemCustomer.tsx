import { observer } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import { FlatList, StyleSheet, Text, TextStyle, View } from 'react-native';
import Dash from 'react-native-dash';

import { COLORS, Styles } from '@/theme';
import Languages from '@/commons/Languages';
import { Configs } from '@/commons/Configs';
import IcArrowRed from '@/assets/images/ic_arrowRed.svg';
import IcArrowGreen from '@/assets/images/ic_arrowGreen.svg';
import { Touchable } from '@/components';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';

const data = [{
    id: 1,
    name: 'Lê Thị Hoa',
    money: '1.000.000.000',
    percent: '16%',
    develop: false
},
{
    id: 2,
    name: 'Đinh Trường Giang',
    money: '1.000.000.000',
    percent: '16%',
    develop: true
},
{
    id: 3,
    name: 'Đinh Trường Giang',
    money: '1.000.000.000',
    percent: '16%',
    develop: true
},
{
    id: 4,
    name: 'Đinh Trường Giang',
    money: '1.000.000.000',
    percent: '16%',
    develop: true
}
];

const TabItemCustomer = observer(() => {

    const keyExtractor = useCallback((index) => {
        return `${index.id}`;
    }, []);

    const navigateToDetail = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.detailCustomer);
    }, []);

    const renderItem = useCallback(({ item }: any) => {
        const color = {
            color: item?.develop ? COLORS.GREEN : COLORS.RED
        } as TextStyle;
        return (
            <Touchable onPress={navigateToDetail}>
                <Dash
                    dashThickness={1}
                    dashLength={10}
                    dashGap={5}
                    dashColor={COLORS.GRAY_1} />
                <View style={styles.wrapItem}>

                    <View>
                        <Text style={styles.txtLabelName}>{Languages.takeCareCustomer.customName}</Text>
                        <Text style={styles.txtName}>{item.name}</Text>
                    </View>
                    <View>
                        <Text style={styles.txtLabel}>{Languages.takeCareCustomer.totalInvested}</Text>
                        <View style={styles.wrapValue}>
                            <Text style={[styles.txtMoney, color]}>{item?.money}</Text>
                            {item?.develop ? <IcArrowGreen /> : <IcArrowRed />}
                            <Text style={[styles.txtPercent, color]}>{item?.percent}</Text>
                        </View>
                    </View>
                </View>
            </Touchable>
        );
    }, [navigateToDetail]);

    const renderHeader = useMemo(() => {
        return <Text style={styles.title}>{Languages.takeCareCustomer.listCustomer}</Text>;
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                renderItem={renderItem}
                contentContainerStyle={styles.flatList}
                ListHeaderComponent={renderHeader}
                keyExtractor={keyExtractor}
            />
        </View>
    );
});

export default TabItemCustomer;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 16
    },
    flatList: {
        backgroundColor: COLORS.WHITE,
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_12
    },
    title: {
        ...Styles.typography.medium,
        textAlign: 'center',
        fontSize: Configs.FontSize.size16,
        color: COLORS.RED,
        marginBottom: 8
    },
    wrapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10
    },
    wrapValue: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    txtLabelName: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12,
        marginBottom: 4
    },
    txtLabel: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12,
        marginBottom: 4,
        textAlign: 'right'
    },
    txtName: {
        ...Styles.typography.regular,
        color: COLORS.BLACK
    },
    txtMoney: {
        ...Styles.typography.regular,
        color: COLORS.GREEN,
        marginRight: 12

    },
    txtPercent: {
        ...Styles.typography.regular,
        color: COLORS.GREEN,
        marginLeft: 4
    }
});
