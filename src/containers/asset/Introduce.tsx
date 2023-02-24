import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';

import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import { IntroduceModel } from '@/models/introduce';
import { COLORS, HtmlStylesSeen, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';

const Introduce = observer(({ route }: any) => {
    const { id, groupId, title } = route.params;

    const { apiServices } = useAppStore();
    // const [productData, setProductData] = useState<ProductModel[]>([]);
    const [introduce, setIntroduce] = useState<IntroduceModel[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const fetchProduct = useCallback(async () => {
        let resIntro;
        if (groupId) {
            resIntro = await apiServices.common.getIntroduceGroup(groupId);
            if (resIntro.success && resIntro.data) {
                setIntroduce([resIntro.data as IntroduceModel]);
            }
        } else {
            resIntro = await apiServices.common.getIntroduce(id);
            if (resIntro.success && resIntro.data) {
                setIntroduce((resIntro.data as IntroduceModel[]));
            }
        }

        // const res = await apiServices.common.getProduces();
        // const dataProducts = res.data as ProductModel[];
        // if (res.success && dataProducts) {
        //     setProductData(dataProducts);
        // }

        setIsLoading(false);
    }, [apiServices.common, groupId, id]);

    useEffect(() => {
        fetchProduct();
    }, []);

    const renderIntro = useMemo(() => {
        return introduce?.length > 0 && <View style={styles.sectionContainer}>
            {/* <View style={styles.row}>
                <IcHelp />
                <Text style={styles.sectionTxt}>
                    {`${Languages.accumulate.intro} ${title}`}
                </Text>
            </View> */}
            <View style={styles.intro}>
                {introduce.map(item => <View key={item.id}>
                    <Text style={styles.section}>{item?.title}</Text>
                    <View style={styles.content}>
                        <RenderHTML key={item.id}
                            contentWidth={SCREEN_WIDTH}
                            source={{ html: item?.description }}
                            tagsStyles={HtmlStylesSeen} />
                    </View>
                </View>)}
            </View>
        </View>;
    }, [introduce]);

    return (
        <View style={styles.container}>
            <HeaderBar
                hasBack
                title={Languages.product.intro} />
            <ScrollView>
                {renderIntro}
                {/* {renderProducts} */}
            </ScrollView>
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

export default Introduce;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    sectionContainer: {
        // ...Styles.shadow,
        // paddingHorizontal: 15,
        // paddingVertical: 10,
        marginHorizontal: 10
        // borderRadius: 10
    },
    sectionTxt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        marginHorizontal: 10
    },
    desTxt: {
        ...Styles.typography.regular,
        marginTop: 10,
        color: COLORS.GRAY_6
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    intro: {
        marginTop: 5
    },
    section: {
        ...Styles.typography.bold,
        color: COLORS.BLACK_PRIMARY,
        fontSize: Configs.FontSize.size16,
        marginTop: 20,
        marginBottom: 10
    },
    btn: {
        marginVertical: 20,
        marginHorizontal: 10
    },
    content: {
        marginTop: 5
    }
});
