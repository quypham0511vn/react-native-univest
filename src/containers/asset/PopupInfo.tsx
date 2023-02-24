import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
import HTMLView from 'react-native-htmlview';

import IcClose from '@/assets/images/ic_close_gray.svg';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Touchable } from '@/components';
import { PopupActions, PopupProps } from '@/components/popup/types';
import { COLORS, HtmlStyles, IconSize, Styles } from '@/theme';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { useAppStore } from '@/hooks';
import { ProductModel } from '@/models/product';
import { IntroduceModel } from '@/models/introduce';
import IcHelp from '@/assets/images/ic_help.svg';
import IcProduct from '@/assets/images/ic_product_2.svg';
import Utils from '@/utils/Utils';
import KeyValueRating from '@/components/KeyValueRating';

interface PopupInfoProps extends PopupProps {
    id?: any;
    groupId: any;
    title: string
}

const PopupInfo = forwardRef<PopupActions, PopupInfoProps>(
    ({
        onClose,
        id,
        groupId,
        title
    }: PopupInfoProps, ref) => {
        const [visible, setVisible] = useState<boolean>(false);

        const { apiServices } = useAppStore();
        const [productData, setProductData] = useState<ProductModel[]>();
        const [introduce, setIntroduce] = useState<IntroduceModel[]>();

        const fetchProduct = useCallback(async () => {
            let resIntro;
            if (groupId) {
                resIntro = await apiServices.common.getIntroduceGroup(groupId);
                if (resIntro.success) {
                    setIntroduce([resIntro.data as IntroduceModel]);
                }
            } else {
                resIntro = await apiServices.common.getIntroduce(id);
                if (resIntro.success) {
                    setIntroduce((resIntro.data as IntroduceModel[]));
                }
            }

            const res = await apiServices.common.getProducesV1();
            const dataProducts = res.data as ProductModel[];
            if (res.success && dataProducts) {
                setProductData(dataProducts);
            }
        }, [apiServices.common, groupId, id]);

        useEffect(() => {
            fetchProduct();
        }, []);

        const renderIntro = useMemo(() => {
            return <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    <IcHelp />
                    <Text style={styles.sectionTxt}>
                        {`${Languages.accumulate.intro} ${title}`}
                    </Text>
                </View>
                <View style={styles.intro}>
                    {introduce?.map(item => item && <>
                        <Text style={styles.section}>{item?.title}</Text>
                        <HTMLView
                            key={item.id}
                            stylesheet={HtmlStyles}
                            value={`<p>${Utils.removeTags(item?.description)}</p>`}
                        />
                    </>)}
                </View>
            </View>;
        }, [introduce, title]);

        const renderProduct = useCallback((item: ProductModel) => {
            return <KeyValueRating
                key={item.title}
                color={COLORS.RED}
                label={item.title}
                value={`${item.interest}${Languages.accumulate.rate}`}
            />;
        }, []);

        const renderProducts = useMemo(() => {
            return <View style={styles.sectionContainer}>
                <View style={styles.row}>
                    <IcProduct />
                    <Text style={styles.sectionTxt}>
                        {Languages.accumulate.products}
                    </Text>
                </View>
                {productData?.map((item) => renderProduct(item))}
            </View>;
        }, [productData, renderProduct]);

        const show = useCallback(() => {
            setVisible(true);
        }, []);

        const hide = useCallback(() => {
            setVisible(false);
            onClose?.();
        }, [onClose]);

        const setErrorMsg = useCallback(() => {
        }, []);

        useImperativeHandle(ref, () => ({
            show,
            hide,
            setErrorMsg
        }));

        const renderDetail = useMemo(() => {
            return <View style={styles.content}>
                {renderIntro}
                {renderProducts}
            </View>;
        }, [renderIntro, renderProducts]);

        return (
            <Modal
                isVisible={visible}
                animationIn="slideInUp"
                useNativeDriver={true}
                onBackdropPress={hide}
                avoidKeyboard={true}
                hideModalContentWhileAnimating
            >
                <View style={styles.popup}>
                    <Touchable
                        style={styles.close}
                        onPress={hide}>
                        <IcClose
                            {...IconSize.size20_20} />
                    </Touchable>

                    <ScrollView
                        style={styles.scrollContent}
                        showsVerticalScrollIndicator={false}>
                        {renderDetail}
                    </ScrollView>
                </View>
            </Modal>
        );
    });

export default PopupInfo;

const styles = StyleSheet.create({
    scrollContent: {
        width: SCREEN_WIDTH - 60
    },
    popup: {
        backgroundColor: COLORS.WHITE,
        borderColor: COLORS.TRANSPARENT,
        borderRadius: 15,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: SCREEN_HEIGHT / 1.3
    },
    close: {
        position: 'absolute',
        right: Configs.FontSize.size10,
        top: Configs.FontSize.size7,
        zIndex: 2
    },
    ic: {
        marginTop: 10,
        justifyContent: 'center'
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        textAlign: 'center',
        marginTop: 20
    },
    txtContent: {
        marginVertical: 10,
        marginHorizontal: 10
    },
    content: {
        marginTop: 10,
        paddingHorizontal: 10
        // width: SCREEN_WIDTH - 40
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    sectionContainer: {
        paddingVertical: 10,
        marginVertical: 10
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
    intro: {
        marginTop: 5
    },
    section: {
        ...Styles.typography.bold,
        color: COLORS.BLACK_PRIMARY,
        fontSize: Configs.FontSize.size16,
        marginTop: 20,
        marginBottom: 10
    }
});
