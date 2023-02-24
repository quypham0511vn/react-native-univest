import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useState } from 'react';
import { LayoutAnimation, ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import RenderHTML from 'react-native-render-html';

import DownIcon from '@/assets/images/ic_down.svg';
import RightIcon from '@/assets/images/ic_right.svg';
import IconSelected from '@/assets/images/ic_selected.svg';
import { Configs, isIOS } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Button, HeaderBar, Touchable } from '@/components';
import Period from '@/components/Period';
import { useAppStore } from '@/hooks';
import { ProductGroupModel, ProductModel } from '@/models/product';
import Navigator from '@/routers/Navigator';
import { COLORS, HtmlStylesSeen, Styles } from '@/theme';
import { PRODUCT_TYPE } from '@/commons/constants';

export interface Arr {
    title: string;
    isShow: boolean;
}

const InvestAccumulate = observer(({ route }: any) => {
    const { apiServices } = useAppStore();
    const [productData, setProductData] = useState<ProductGroupModel[]>([]);
    const [itemSelected, setItemSelected] = useState<ProductModel>();
    const [selected, setSelected] = useState<number>();
    const [name, setName] = useState<string>();
    const isUnlimited = route.params.isUnlimited;
    const isInvest = route.params.isInvest;
    const isConvert = route.params.isConvert;
    const  [arrShow, setArrShow] = useState<Arr[]>([]);
    const [toggle, setToggle] = useState<boolean>(false);

    const fetchProduct = useCallback(async () => {
        const res = await apiServices.common.getProduces();
        if (res.success) {
            const dataProducts = isInvest ? (res.data as ProductModel[]) : (res.data as ProductModel[]).filter(item => item.parent_type !== PRODUCT_TYPE.FLEXIBLE);
            const group = [] as ProductGroupModel[];
            const _arrShow = [];
            for (let index = 0; index < dataProducts.length; index++) {
                const product = dataProducts[index];
                _arrShow.push({ title: dataProducts[index].parent_name, isShow: true });
                setArrShow(_arrShow);
                const currentGroup = group.find(item => item.parent_id === product.parent_id);
                if (currentGroup) {
                    currentGroup.child = [...currentGroup.child, product];
                } else {
                    group.push({
                        parent_id: product.parent_id,
                        parent_name: product?.parent_name,
                        parent_title: product.parent_title,
                        child: [product],
                        isExpanded: true

                    });
                }
            }
            setProductData(group);
        }
    }, [apiServices.common, isInvest]);

    useEffect(() => {
        fetchProduct();
    }, []);

    const onInvest = useCallback(() => {
        console.log('package:  ', itemSelected);
        const _isUnlimited = isUnlimited || itemSelected?.period === 0;
        Navigator.pushScreen(ScreenNames.topUp, { isInvest: false, isUnlimited: _isUnlimited, id: itemSelected?.id, isConvert, package: itemSelected });
    }, [isConvert, isUnlimited, itemSelected]);

    const renderProduct = useCallback((item: ProductGroupModel) => {

        const styleContainer = {
            backgroundColor: item.child[0].child?.length > 1 ? COLORS.GRAY_3 : (selected === item.parent_id ? COLORS.WHITE : COLORS.GRAY_3),
            borderRadius: 10
        } as ViewStyle;
    
        const onPress = (id: number, pk: ProductModel, packageGroup: ProductGroupModel[]) => {
            const _arrShow = arrShow;

            for(let i = 0; i < _arrShow.length; i++) {
                if(pk.name_parent === _arrShow[i].title ) {
                    if(_arrShow[i].isShow ) {
                        _arrShow[i].isShow = false;
                
                    } else {
                        _arrShow[i].isShow = true;
                    }
                    break;
                }
            }
            setArrShow(_arrShow);
            if (packageGroup?.child?.length === 1) {
                setItemSelected(pk);
                setSelected(id);
            }
            setName(pk?.name_parent);
            setTimeout(() => {
                setToggle(last => !last);
            }, 200);
            if (isIOS && packageGroup?.length > 1) {
                LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut
                );
            }
        };


        const onClick = (id: number, pk: ProductModel, packageGroup: ProductGroupModel[]) => {
            onPress(id, pk, packageGroup);
        };

        const renderBtnProductChildren = (itemChildren: ProductModel) => {

            const onPressChild = (id:number, pk: ProductModel) => { 
                setSelected(id);
                setItemSelected(pk);
            };

            const onpressProductChilden = () => {
                onPressChild(itemChildren?.id, itemChildren);
            };

            const style = {
                backgroundColor: itemChildren?.id === selected ? COLORS.WHITE : COLORS.GRAY_3
            } as ViewStyle;

            return (
                <Touchable
                    style={[styles.lastItemProduct, style]}
                    onPress={onpressProductChilden}
                >
                    <View style={styles.row}>
                        <Period
                            period={itemChildren?.period}
                            type={itemChildren?.type_period}
                            id={itemChildren?.parent_id}
                        />
                        <View style={styles.wrapText}>
                            <Text style={styles.txtTitle}>{itemChildren?.title}</Text>
                            <RenderHTML
                                contentWidth={SCREEN_WIDTH}
                                source={{ html: itemChildren?.description }}
                                tagsStyles={HtmlStylesSeen}
                            />
                        </View>
                    </View>
                    <View style={styles.icon}>
                        {itemChildren?.id === selected && <IconSelected />}
                    </View>
                </Touchable>
            );
        };

        const renderViewChildProduct = (productsGroup: ProductGroupModel) => {
            return (
                <View style={styles.containerChild}>
                    {productsGroup?.child[0]?.child?.map(
                        (itemModel: ProductModel, indexArr?: number) => {
                            return (
                                <View key={indexArr}>
                                    {renderBtnProductChildren(itemModel)}
                                </View>
                            );
                        }
                    )}
                </View >
            );
        };

        return (
            <View style={styles.containerProduct}>
                <Touchable
                    style={[styles.itemProduct, styleContainer]}
                    onPress={() => {  
                        onClick(item?.parent_id, item?.child?.[0]?.child?.[0], item?.child?.[0]);
                    }}
                    radius={10}
                    key={item?.parent_id}
                >
                    <View style={styles.row}>
                        <Period period={0} type={0} id={item?.parent_id} />
                        <View style={styles.wrapText}>
                            <Text style={styles.txtTitle}>{item?.parent_name}</Text>
                            <RenderHTML
                                contentWidth={SCREEN_WIDTH}
                                source={{ html: item?.parent_title }}
                                tagsStyles={HtmlStylesSeen}
                            />
                        </View>
                    </View>
                    {item?.child[0]?.child.length > 1 && <>
                        {
                            arrShow.map((arr:any, indexArr:number) => {
                                return(
                                    <View key={indexArr}>
                                        {item?.parent_name === arr?.title && (arr?.isShow  ?  (<DownIcon width={8} height={8} />) : ( <RightIcon width={8} height={8} /> ))}
                                    </View>
                                );
                            })
                        }
                    </> }
                  
                </Touchable>
             
                {
                    arrShow.map((arr, indexArr) => {
                        return(
                            <View key={indexArr}>
                                {item?.parent_name === arr?.title && item?.child[0]?.child?.length > 1 && arr?.isShow && renderViewChildProduct(item)}
                            </View>
                        );
                    })
                }

                {item?.child[0]?.child?.length === 1 && <View style={styles.icon}>
                    {itemSelected?.parent_id === item.parent_id && <IconSelected />}
                </View>}
            </View>
        );
    }, [selected, arrShow, itemSelected?.parent_id, toggle]);

    return (
        <>
            <HeaderBar
                title={Languages.investAccumulate.header} />
            <View style={styles.wrapContent}>
                <Text style={styles.select}>{Languages.investAccumulate.select}</Text>

                <ScrollView style={styles.container}>
                    {productData?.length > 0 && (
                        <>
                            {productData.map((group: any) => (
                                <View key={group?.parent_id} style={styles.wrapProduct2}>
                                    {renderProduct(group)}
                                </View>
                            ))}
                        </>
                    )}
                </ScrollView>

                <Button
                    style={styles.button}
                    label={Languages.investAccumulate.confirmInvest}
                    onPress={onInvest}
                    buttonStyle={itemSelected ? 'RED' : 'GRAY'}
                    disabled={!itemSelected}
                />
            </View>
        </>
    );
});
export default InvestAccumulate;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    containerProduct: {
        justifyContent: 'center',
        alignContent: 'center'
    },
    wrapContent: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 10
    },
    row: {
        paddingVertical: 5,
        borderRadius: 10,
        paddingRight: 20,
        alignItems: 'center',
        flexDirection: 'row'
    },
    select: {
        ...Styles.typography.bold,
        marginTop: 20,
        marginBottom: 10,
        marginLeft: 15,
        fontSize: Configs.FontSize.size16
    },
    icon: {
        position: 'absolute',
        right: 10
    },
    button: {
        marginVertical: 20,
        marginHorizontal: 10
    },
    lastItemProduct: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 4,
        marginHorizontal: 4
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size15,
        color: COLORS.BLACK_PRIMARY
    },
    itemProduct: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomColor: COLORS.GRAY_1,
        alignItems: 'center'
    },
    wrapProduct2: {
        ...Styles.shadow,
        marginHorizontal: 16,
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: COLORS.GRAY_1,
        marginVertical: 10,
        borderColor: COLORS.GRAY_1,
        borderWidth: 1
    },
    wrapText: {
        marginLeft: 5,
        flex: 1
    },
    containerChild: {
        marginTop: 4,
        backgroundColor: COLORS.TRANSPARENT
    }
});
