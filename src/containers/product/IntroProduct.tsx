import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import RenderHTML from 'react-native-render-html';

import { Button, HeaderBar } from '@/components';
import { Configs, PADDING_BOTTOM } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { COLORS, HtmlStylesSeen, Styles } from '@/theme';
import { ProductModel } from '@/models/product';
import { useAppStore } from '@/hooks';
import Navigator from '@/routers/Navigator';
import ScreenNames from '@/commons/ScreenNames';
import { IntroduceModel } from '@/models/introduce';
import MyLoading from '@/components/MyLoading';
import SessionManager from '@/managers/SessionManager';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';

const IntroProduct = ({ route }: any) => {
    const { apiServices, userManager, fastAuthInfo } = useAppStore();
    const [product] = useState<ProductModel>(route?.params);
    const [productDetails, setProductDetails] = useState<ProductModel>();
    const [introduce, setIntroduce] = useState<IntroduceModel[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    const fetchProductDetails = useCallback(async (id: number) => {
        const resIntro = await apiServices.common.getIntroduce(id);
        if (resIntro?.success && resIntro?.data) {
            setIntroduce((resIntro.data as IntroduceModel[]));
        }

        const res = await apiServices.common.getProductDetails(id);
        if (res.success) {
            const dataProduct = res?.data as ProductModel;
            setProductDetails(dataProduct);
        }

        setLoading(false);
    }, [apiServices.common]);

    useEffect(() => {
        fetchProductDetails(product.id);
    }, [fetchProductDetails, product.id]);

    const onInvest = useCallback(() => {
        if (!userManager.userInfo || fastAuthInfo?.isEnableFastAuth) {
            SessionManager.lastTabIndexBeforeOpenAuthTab = 0;
            Navigator.pushScreen(ScreenNames.auth);
        } else {
            Navigator.pushScreen(ScreenNames.topUp, {
                isInvest: true,
                id: product.id,
                isUnlimited: product.period === 0
            });
        }
    }, [fastAuthInfo?.isEnableFastAuth, product.id, product.period, userManager.userInfo]);

    const renderAutoDescription = useMemo(() => {
        return <>
            <Text style={styles.txtTitle}>{`${Languages.product.package} ${product.title.toLowerCase()}`}</Text>

            <View style={styles.row}>
                <Text style={styles.contentTitle}>{Languages.product.interest}</Text>
                <Text style={styles.contentText}>
                    {Languages.product.dot}
                    {productDetails?.interest}
                </Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.contentTitle}>{Languages.product.form}</Text>
                <View style={styles.form}>
                    <Text style={styles.contentText}>
                        {Languages.product.dot}
                        {`${productDetails?.form}`}
                    </Text>
                    <Text style={styles.contentText}>
                        {Languages.product.dot}
                        {`${productDetails?.description}`}
                    </Text>
                </View>
            </View>
        </>;
    }, [product.title, productDetails?.description, productDetails?.form, productDetails?.interest]);

    const renderDescription = useMemo(() => {
        return introduce?.map(item => {
            return <View key={item.id}>
                <Text style={styles.section}>{item?.title}</Text>
                <View style={styles.content}>
                    <RenderHTML
                        contentWidth={SCREEN_WIDTH}
                        source={{ html: item?.description }}
                        tagsStyles={HtmlStylesSeen} />
                </View>
            </View>;
        });
    }, [introduce]);

    return (
        <View style={styles.mainContainer}>
            <HeaderBar hasBack title={Languages.product.intro} />
            {isLoading ? <MyLoading isOverview /> : <>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {introduce?.length > 0 ? renderDescription : renderAutoDescription}
                </ScrollView>

                <Button
                    style={styles.btn}
                    label={Languages.product.investNow}
                    onPress={onInvest}
                    buttonStyle={'RED'}
                />
            </>}
        </View>
    );
};

export default IntroProduct;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    scrollContent: {
        paddingHorizontal: 10
    },
    btn: {
        marginVertical: 20,
        marginHorizontal: 10
    },
    txtTitle: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size16,
        marginBottom: 12
    },
    contentText: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        marginBottom: 12
    },
    row: {
        flexDirection: 'row'
    },
    form: {
        justifyContent: 'space-between',
        marginRight: 10,
        flex: 1
    },
    section: {
        ...Styles.typography.bold,
        color: COLORS.BLACK_PRIMARY,
        fontSize: Configs.FontSize.size16,
        marginTop: 20,
        marginBottom: 10
    },
    contentTitle: {
        ...Styles.typography.regular,
        color: COLORS.BLACK_PRIMARY,
        fontSize: Configs.FontSize.size16,
        marginBottom: 12,
        marginHorizontal: 10
    },
    content: {
        // marginLeft: 5
        marginTop: 5
    }
});
