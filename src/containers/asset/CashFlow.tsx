import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import React, { useCallback, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import {
    VictoryAxis,
    VictoryBar,
    VictoryChart,
    VictoryTheme,
    VictoryZoomContainer
} from 'victory-native';

import { COLORS, Styles } from '@/theme';
import { HeaderBar, Touchable } from '@/components';
import Languages from '@/commons/Languages';
import { Configs } from '@/commons/Configs';
import { SCREEN_HEIGHT } from '@/utils/DimensionUtils';

const data = [
    { x: '1/1/2021', y: 13000 },
    { x: '2/1/2021', y: 16500 },
    { x: '3/1/2021', y: 14250 },
    { x: '4/1/2021', y: 12000 },
    { x: '5/1/2021', y: 11000 },
    { x: '6/1/2021', y: 20000 },
    { x: '7/1/2021', y: 12000 },
    { x: '8/1/2021', y: 11000 },
    { x: '9/1/2021', y: 20000 },
    { x: '10/1/2021', y: 25000 }
];
const styleVictoryBar = {
    data: {
        fill: ({ datum }: any) => datum.fill || COLORS.RED_2,
        stroke: 'black',
        strokeWidth: 0
    },
    labels: {
        fontSize: Configs.FontSize.size13,
        fill: ({ datum }: any) => (datum.x === 3 ? '#000000' : '#c43a31'),
        fonFamily: Configs.FontFamily.bold
    }
};
const timeOff = [
    {
        id: 1,
        title: 'Ngày'
    },
    {
        id: 2,
        title: 'Tuần'
    },
    {
        id: 3,
        title: 'Tháng'
    },
    {
        id: 4,
        title: 'Năm'
    }
];
const axisVerOption = {
    axis: { stroke: COLORS.BLACK, strokeWidth: 0.3 },
    ticks: { size: 0 },
    grid: { stroke: COLORS.GRAY_7, strokeWidth: 1 },
    tickLabels: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium
    }
};
const axisHorOption = {
    axis: { stroke: COLORS.BLACK, strokeWidth: 0.2 },
    ticks: { size: 0 },
    tickLabels: {
        fontSize: Configs.FontSize.size12,
        angle: -25
    }
};

const CashFlow = () => {
    const [onSelected, setOnSelected] = useState<any>(timeOff[0]);

    const formatTicks = (t: any) => {
        if (t >= 1000) {
            return `${Math.round(t) / 1000}K`;
        }
        if (Number.isInteger(t)) {
            return `${Math.round(t)}`;
        }
        return '';
    };

    const renderItemTimeOff = useCallback(
        ({ item }) => {
            const onPress = () => {
                setOnSelected(item);
            };
            const style =
        onSelected.id === item.id
            ? {
                backgroundColor: COLORS.WHITE,
                borderColor: COLORS.RED,
                borderWidth: 1
            }
            : {
                backgroundColor: COLORS.GRAY_1
            };

            const textStyle =
        onSelected.id === item.id
            ? { color: COLORS.RED }
            : { color: COLORS.GRAY_6 };

            return (
                <Touchable onPress={onPress} style={[styles.item, style]}>
                    <Text style={[styles.txtItem, textStyle]}>{item.title}</Text>
                </Touchable>
            );
        },
        [onSelected]
    );

    const keyExtractor = useCallback((index) => {
        return `${index.id}`;
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.cashFlow.title} />
            <View style={styles.wrapTimeOff}>
                <FlatList
                    data={timeOff}
                    renderItem={renderItemTimeOff}
                    horizontal={true}
                    keyExtractor={keyExtractor}
                    scrollEnabled={false}
                />
            </View>
            <View>
                <Text style={styles.txtVND}>VND</Text>
                <View style={styles.chart}>
                    <VictoryChart
                        // animate={{
                        //     duration: 1000,
                        //     onLoad: { duration: 500 }
                        // }}
                        width={SCREEN_WIDTH}
                        height={SCREEN_HEIGHT / 2}
                        domainPadding={{ x: 10, y: 40 }}
                        theme={VictoryTheme.material}
                        padding={styles.victoryChart}
                        containerComponent={
                            <VictoryZoomContainer
                                allowZoom={false}
                                allowPan={true}
                                zoomDomain={{ x: [0, 5] }}
                            />
                        }
                    >
                        <VictoryAxis
                            // animate={{
                            //     duration: 1000,
                            //     onLoad: { duration: 500 }
                            // }}
                            dependentAxis
                            style={axisVerOption}
                            standalone={false}
                            tickCount={6}
                            tickFormat={formatTicks}
                            padding={100}
                        />

                        <VictoryAxis style={axisHorOption} />
                        <VictoryBar
                            barRatio={0.8}
                            style={styleVictoryBar}
                            alignment={'middle'}
                            barWidth={30}
                            data={data}
                            labels={({ datum }) => `${formatTicks(datum.y)}`}
                        />
                    </VictoryChart>
                </View>
            </View>
        </View>
    );
};
export default CashFlow;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    chart: {
        flexDirection: 'row'
    },
    wrapTimeOff: {
        paddingHorizontal: 16,
        marginTop: 25
    },
    item: {
        paddingVertical: 10,
        width: (SCREEN_WIDTH - 62) / 4,
        backgroundColor: COLORS.WHITE,
        marginRight: 10,
        alignItems: 'center',
        borderRadius: 5
    },
    txtItem: {
        ...Styles.typography.medium,
        color: COLORS.RED
    },
    victoryChart: {
        top: 10,
        bottom: 35,
        left: 45
    },
    txtVND: {
        ...Styles.typography.bold,
        marginLeft: 30,
        marginTop: 30,
        color: COLORS.BACKDROP
    }
});
