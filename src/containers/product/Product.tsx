import PasscodeAuth from "@el173/react-native-passcode-auth";
import { observer } from "mobx-react";
import React, {
    useCallback,
    useEffect,
    useMemo, useState
} from "react";
import {
    LayoutAnimation,
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    ViewProps
} from "react-native";
import Dash from "react-native-dash";
import LinearGradient from "react-native-linear-gradient";
import RenderHTML from "react-native-render-html";

import { API_CONFIG, LINK } from "@/api/constants";
import IconAboutUs from "@/assets/images/ic_aboutus.svg";
import BankIcon from "@/assets/images/ic_bank.svg";
import BankActiveIcon from "@/assets/images/ic_bank_active.svg";
import IconBell from "@/assets/images/ic_bell.svg";
import ContractIcon from "@/assets/images/ic_contract.svg";
import DownIcon from "@/assets/images/ic_down.svg";
import MarkIcon from "@/assets/images/ic_eKYC.svg";
import MarkIconActive from "@/assets/images/ic_eKYC_active.svg";
import EmailIcon from "@/assets/images/ic_email.svg";
import EmailActiveIcon from "@/assets/images/ic_email_active.svg";
import IcPackage from "@/assets/images/ic_package.svg";
import PhoneIcon from "@/assets/images/ic_phone.svg";
import RightIcon from "@/assets/images/ic_right.svg";
import IcUnlimited from "@/assets/images/ic_unlimited.svg";
import IcWarning from "@/assets/images/ic_warning.svg";
import { Configs, isIOS } from "@/commons/Configs";
import { ENUM_BIOMETRIC_TYPE } from "@/commons/constants";
import Languages from "@/commons/Languages";
import ScreenNames from "@/commons/ScreenNames";
import { Button, Touchable } from "@/components";
import { BUTTON_STYLES } from "@/components/elements/button/constants";
import { MyImageView } from "@/components/image";
import Period from "@/components/Period";
import { useAppStore } from "@/hooks";
import SessionManager from "@/managers/SessionManager";
import { BannerNewsModel } from "@/models/banner";
import { NotificationPopupModel } from "@/models/notification-popup";
import { ProductGroupModel, ProductModel } from "@/models/product";
import { UserInfoModel } from "@/models/user-model";
import Navigator from "@/routers/Navigator";
import { COLORS, HtmlStylesSeen, Styles } from "@/theme";
import AnalyticsUtils from "@/utils/AnalyticsUtils";
import { SCREEN_WIDTH } from "@/utils/DimensionUtils";
import AsyncStorage from "@react-native-community/async-storage";
import Modal from "react-native-modal";
import Banner from "./Banner";
import BannerNews from "./BannerNews";
import { NotifyListener } from "./NotifyListener";
import PopupNotify from "./PopupNotify";

export interface Arr {
    title: string;
    isShow: boolean;
}

const Product = observer(() => {
    const { userManager, fastAuthInfo, apiServices, notifyManager } = useAppStore();
    const [productData, setProductData] = useState<ProductGroupModel[]>([]);
    const [newsData, setNewsData] = useState<BannerNewsModel[]>([]);
    const [popupNotifyData, setPopupNotifyData] = useState<NotificationPopupModel[]>([]);
    const [newsAboutUsData, setNewsAboutUsData] = useState<BannerNewsModel[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(true);
    const [show, setShow] = useState<boolean>(false);
    const [name, setName] = useState<string>();
    const [arrShow, setArrShow] = useState<Arr[]>([]);
    const [toggle, setToggle] = useState<boolean>(false);

    const onGotoAccount = useCallback(() => {
        if (fastAuthInfo.isEnableFastAuth) {
            SessionManager.lastTabIndexBeforeOpenAuthTab = 0;
            Navigator.navigateScreen(ScreenNames.auth);
        } else if (!fastAuthInfo.isEnableFastAuth)
            Navigator.pushScreen(ScreenNames.account);
    }, [fastAuthInfo.isEnableFastAuth]);

    const onGotoNotification = useCallback(() => {
        Navigator.pushScreen(SessionManager.usingOldNotifyApi ? ScreenNames.notificationOld : ScreenNames.notification);
    }, []);

    const fetchProduct = useCallback(async () => {
        const res = await apiServices.common.getProduces();
        const _arrShow = [];
        if (res.success) {
            const dataProducts = res.data as ProductGroupModel[];
            for (let i = 0; i < dataProducts.length; i++) {
                _arrShow.push({ title: dataProducts[i].parent_name, isShow: true });
            }
            setArrShow(_arrShow);
            setProductData(dataProducts);
        }
        setIsRefreshing(false);
    }, [apiServices.common]);

    const fetchNews = useCallback(async () => {
        const resNews = await apiServices.common.getNews();
        if (resNews.success) {
            setNewsData(resNews.data as BannerNewsModel[]);
        }
        setIsRefreshing(false);
    }, [apiServices.common]);

    // function get notification popup
    const getPopupNotify = useCallback(async () => {
        const res: any = await apiServices.notify.getNotifyPopup();
        if (res?.code === 401) {
            SessionManager.usingOldNotifyApi = true;
        } else {
            const newDataItem = res?.data?.items;

            if (res.success && newDataItem.length > 0) {
                notifyManager.setHasNotify(true);
                setPopupNotifyData(newDataItem as NotificationPopupModel[]);
            }
        }
    }, [apiServices.common]);

    const fetchNewsAboutUs = useCallback(async () => {
        const resNewsAboutUs = await apiServices.common.getNewsAboutUs();
        if (resNewsAboutUs.success) {
            setNewsAboutUsData(resNewsAboutUs.data as BannerNewsModel[]);
        }
        setIsRefreshing(false);
    }, [apiServices.common]);

    useEffect(() => {
        setTimeout(() => {
            StatusBar.setBarStyle(
                userManager.userInfo ? "light-content" : "dark-content",
                true
            );
        }, 100);

        if (userManager.userInfo) {
            getPopupNotify();
        }
    }, [userManager.userInfo]);

    useEffect(() => {
        fetchProduct();
        fetchNews();
        fetchNewsAboutUs();
        AnalyticsUtils.trackScreen(ScreenNames.product);
        auth();
    }, []);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchNews();
        fetchNewsAboutUs();
        fetchProduct();
    }, [fetchNews, fetchNewsAboutUs, fetchProduct]);

    const auth = useCallback(() => {
        if (
            fastAuthInfo.isEnableFastAuth &&
            fastAuthInfo?.supportedBiometry === ENUM_BIOMETRIC_TYPE.FACE_ID
        ) {
            PasscodeAuth.authenticate(Languages.quickAuThen.description)
                .then(() => {
                    fastAuthInfo.setEnableFastAuthentication(false);
                })
                .catch(() => { });
        }
    }, [fastAuthInfo]);

    const renderHeader = useMemo(() => {
        return userManager.userInfo ? (
            <View style={styles.headerContainer}>
                {Platform.OS === "ios" ? null : (
                    <StatusBar
                        translucent
                        backgroundColor={"transparent"}
                        barStyle={"light-content"}
                    />
                )}
                <LinearGradient
                    end={{ x: 3, y: 1 }}
                    colors={[COLORS.RED, COLORS.WHITE]}
                    style={styles.circle}
                />
                <LinearGradient
                    end={{ x: -4, y: 1 }}
                    colors={[COLORS.RED, COLORS.WHITE]}
                    style={styles.circle2}
                />
                <View style={styles.headerContent}>
                    <Touchable
                        style={styles.wrapInfo}
                        onPress={onGotoAccount}
                        radius={20}
                    >
                        <View style={styles.wrapAvatarImage}>
                            <MyImageView
                                style={styles.wrapAvatar}
                                imageUrl={
                                    userManager.userInfo?.personal_photo || LINK.DEFAULT_AVATAR
                                }
                                resizeMode={"stretch"}
                            />
                        </View>
                        <View style={styles.wrapInfoText}>
                            <Text style={styles.txtWelcome}>{Languages.product.welcome}</Text>
                            <Text numberOfLines={1} style={styles.txtName}>
                                {userManager.userInfo?.full_name || userManager.userInfo?.phone}
                            </Text>
                        </View>
                    </Touchable>
                    <Touchable style={styles.wrapBell} onPress={onGotoNotification}>
                        <IconBell style={styles.iconBell} width={20} height={20} />
                        {notifyManager.totalNotifications > 0 && <View style={styles.wrapCount}>
                            <Text style={styles.txtNotify}>
                                {notifyManager.totalNotifications >= 100
                                    ? "99+"
                                    : notifyManager.totalNotifications}
                            </Text>
                        </View>}
                    </Touchable>
                </View>
            </View>
        ) : (
            <StatusBar
                translucent
                backgroundColor={"transparent"}
                barStyle={"dark-content"}
            />
        );
    }, [
        notifyManager.totalNotifications,
        onGotoAccount,
        onGotoNotification,
        userManager.userInfo,
    ]);

    const renderProduct = useCallback(
        (item: ProductGroupModel, isLastItem: boolean) => {
            const _arrShow = arrShow;
            const onPress = (productItems: ProductModel) => {
                Navigator.pushScreen(ScreenNames.productIntro, {
                    title: Languages.product.productIsSelling,
                    url: API_CONFIG.WEB_URL + LINK.INFO_INTEREST + productItems.id,
                    product: productItems,
                    enableInvest: true,
                });
            };

            const checkItem = (productItem: ProductGroupModel) => {
                for (let i = 0; i < _arrShow.length; i++) {
                    if (productItem.parent_name === _arrShow[i].title) {
                        if (_arrShow[i].isShow) {
                            _arrShow[i].isShow = false;
                        } else {
                            _arrShow[i].isShow = true;
                        }
                        return true;
                    }
                }
                return false;
            };

            const renderItem = (groupProductItem: ProductGroupModel) => {
                if (groupProductItem?.child.length > 1) {
                    if (!checkItem(groupProductItem)) {
                        _arrShow.push({
                            title: groupProductItem.parent_name,
                            isShow: true,
                        });
                    }
                    setArrShow(_arrShow);
                    setShow(!show);
                    setName(groupProductItem?.parent_name);
                    setTimeout(() => {
                        setToggle((last) => !last);
                    }, 200);
                    if (isIOS) {
                        LayoutAnimation.configureNext(
                            LayoutAnimation.Presets.easeInEaseOut
                        );
                    }
                } else {
                    onPress(groupProductItem?.child?.[0]);
                }
            };

            const renderBtnProductChildren = (itemChildren: ProductModel) => {
                const navigateWebViewProductChilden = () => {
                    onPress(itemChildren);
                };

                return (
                    <Touchable
                        style={styles.lastItemProduct}
                        onPress={navigateWebViewProductChilden}
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
                        <RightIcon width={8} height={8} />
                    </Touchable>
                );
            };

            const renderViewChildProduct = (productsGroup: ProductGroupModel) => {
                return (
                    <>
                        {productsGroup?.child?.map(
                            (itemModel: ProductModel, index: number) => {
                                return (
                                    <View key={`${index}${itemModel.name_parent}`}>
                                        <View style={styles.wrapChildProduct}>
                                            <Dash
                                                dashThickness={1}
                                                dashLength={3}
                                                dashGap={1}
                                                dashColor={COLORS.GRAY_13}
                                            />
                                        </View>
                                        {renderBtnProductChildren(itemModel)}
                                    </View>
                                );
                            }
                        )}
                    </>
                );
            };

            const onPressItemParentProduct = () => {
                renderItem(item);
            };

            return (
                <>
                    <Touchable
                        style={styles.itemProduct}
                        onPress={onPressItemParentProduct}
                        radius={16}
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
                        {arrShow.map((arr, index) => {
                            return (
                                <View key={index}>
                                    {item?.parent_name === arr?.title &&
                                        (arr?.isShow ? (
                                            <DownIcon width={8} height={8} />
                                        ) : (
                                            <RightIcon width={8} height={8} />
                                        ))}
                                </View>
                            );
                        })}
                    </Touchable>
                    {arrShow.map((arr, index) => {
                        return (
                            <View key={index}>
                                {item?.parent_name === arr?.title &&
                                    item?.child?.length > 1 &&
                                    arr?.isShow &&
                                    renderViewChildProduct(item)}
                            </View>
                        );
                    })}
                </>
            );
        },
        [show, arrShow]
    );

    const onNavigateKyc = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.informationAccount);
    }, []);

    const onNavigateContract = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.e_contract);
    }, []);

    const onNavigateLinkAccount = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.linkAccount);
    }, []);

    const onNavigateEmail = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.editProfile);
    }, []);

    const renderInfoItem = useCallback(
        (icon: any, title: string, active: boolean, onPress?: any) => {
            const styleText = {
                color: active ? COLORS.RED : COLORS.GRAY_6,
            } as ViewProps;

            return (
                <Touchable onPress={onPress} style={styles.itemInfo}>
                    {icon}
                    <Text style={[styles.txtItemInfo, styleText]}>{title}</Text>
                </Touchable>
            );
        },
        []
    );

    const renderUserInfo = useMemo(() => {
        const user = userManager?.userInfo as UserInfoModel;
        if (!user) {
            return null;
        }
        if (user?.accuracy !== 1 || !user?.email || !user?.affiliate) {
            return (
                <>
                    <Text style={styles.txtHeader}>{Languages.product.information}</Text>
                    <View style={styles.containerInfo}>
                        <Text style={styles.txtSecurity}>
                            {Languages.product.securityWarning}
                        </Text>
                        <View style={styles.rowItem}>
                            {renderInfoItem(
                                userManager.userInfo?.email ? (
                                    <EmailActiveIcon />
                                ) : (
                                    <EmailIcon />
                                ),
                                Languages.product.email,
                                !!userManager.userInfo?.email,
                                onNavigateEmail
                            )}
                            {renderInfoItem(
                                <PhoneIcon />,
                                Languages.product.phone,
                                !!userManager.userInfo?.phone
                            )}
                            {renderInfoItem(
                                userManager.userInfo?.accuracy === 1 ? (
                                    <MarkIconActive />
                                ) : (
                                    <MarkIcon />
                                ),
                                Languages.product.any,
                                userManager?.userInfo?.accuracy === 1,
                                onNavigateKyc
                            )}
                            {renderInfoItem(
                                <ContractIcon />,
                                Languages.product.contract,
                                true,
                                onNavigateContract
                            )}
                            {renderInfoItem(
                                userManager.userInfo?.affiliate ? (
                                    <BankActiveIcon />
                                ) : (
                                    <BankIcon />
                                ),
                                Languages.product.account,
                                !!userManager.userInfo?.affiliate,
                                onNavigateLinkAccount
                            )}
                        </View>
                    </View>
                </>
            );
        }
        return null;
    }, [
        onNavigateContract,
        onNavigateEmail,
        onNavigateKyc,
        onNavigateLinkAccount,
        renderInfoItem,
        userManager.userInfo,
    ]);

    const renderTip = useMemo(() => {
        if (userManager.userInfo) {
            return renderUserInfo;
        }

        const onNavigateLogin = () => {
            Navigator.navigateToDeepScreen(
                [ScreenNames.auth],
                SessionManager.isEnableFastAuthentication
                    ? ScreenNames.loginWithBiometry
                    : ScreenNames.login
            );
        };

        const onNavigateRegister = () => {
            Navigator.navigateToDeepScreen([ScreenNames.auth], ScreenNames.signUp);
        };

        return (
            <View style={styles.tipContainer}>
                <Text style={styles.txtSession}>{Languages.product.authTip}</Text>
                <View style={styles.row}>
                    <Button
                        onPress={onNavigateLogin}
                        label={Languages.auth.login}
                        buttonStyle={BUTTON_STYLES.RED}
                        style={styles.btn}
                    />
                    <Button
                        onPress={onNavigateRegister}
                        label={Languages.auth.register}
                        buttonStyle={BUTTON_STYLES.PINK}
                        style={styles.btn}
                    />
                </View>
            </View>
        );
    }, [renderUserInfo, userManager.userInfo]);

    const onHtmlViewAboutUs = useCallback(() => {
        Navigator.pushScreen(ScreenNames.myWebview, {
            title: Languages.common.news,
            url: API_CONFIG.WEB_URL + LINK.ABOUT_US,
        });
    }, []);

    const onHtmlViewUseManual = useCallback(() => {
        Navigator.pushScreen(ScreenNames.myWebview, {
            title: Languages.common.news,
            url: API_CONFIG.WEB_URL + LINK.USE_MANUAL,
        });
    }, []);

    const onHtmlViewTLuy = useCallback(() => {
        Navigator.pushScreen(ScreenNames.myWebview, {
            title: Languages.common.news,
            url: API_CONFIG.WEB_URL + LINK.TICH_LUY,
        });
    }, []);

    const onHtmlViewTuiUni = useCallback(() => {
        Navigator.pushScreen(ScreenNames.myWebview, {
            title: Languages.common.news,
            url: API_CONFIG.WEB_URL + LINK.TUI_UNIVEST,
        });
    }, []);

    const renderPopups = useMemo(() => {
        return <Modal
            isVisible={notifyManager._HasNotify}
            animationIn="slideInUp"
            useNativeDriver={true}
            onBackdropPress={() =>
                notifyManager.setHasNotify(false)
            }
            avoidKeyboard={true}
            hideModalContentWhileAnimating
            style={styles.popupNotifyContainer}
        >
            <PopupNotify data={popupNotifyData} />
        </Modal>
    }, [popupNotifyData, notifyManager._HasNotify])

    return (
        <NotifyListener>
            <View style={styles.container}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    nestedScrollEnabled={true}
                    contentContainerStyle={
                        !userManager.userInfo && styles.contentContainer
                    }
                    refreshControl={
                        <RefreshControl
                            tintColor={COLORS.RED}
                            colors={[COLORS.RED, COLORS.GREEN, COLORS.GRAY_1]}
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                        />
                    }
                >
                    {renderHeader}
                    {newsData?.length > 0 && (
                        <>
                            <Text style={styles.txtHeader}>{Languages.product.hotNews}</Text>
                            <BannerNews banners={newsData} />
                        </>
                    )}
                    {productData?.length > 0 && (
                        <>
                            <Text style={styles.txtHeader}>
                                {Languages.product.productIsSelling}
                            </Text>
                            {productData.map((group, index) => (
                                <View key={group?.parent_id} style={styles.wrapProduct2}>
                                    {renderProduct(group, index === group.child.length - 1)}
                                </View>
                            ))}
                        </>
                    )}
                    {renderTip}
                    {newsAboutUsData?.length > 0 && (
                        <>
                            <Text style={styles.txtHeader}>{Languages.product.trust}</Text>
                            <Banner banners={newsAboutUsData} noTitle />
                        </>
                    )}
                    <Text style={styles.txtHeader}>{Languages.product.utilities}</Text>
                    <View style={styles.rowGuide}>
                        <Touchable style={styles.itemUtility} onPress={onHtmlViewAboutUs}>
                            <View style={styles.border}>
                                <IconAboutUs />
                            </View>
                            <Text style={styles.txtUtility}>{Languages.product.tips[0]}</Text>
                        </Touchable>
                        <Touchable style={styles.itemUtility} onPress={onHtmlViewUseManual}>
                            <IcWarning />
                            <Text style={styles.txtUtility}>{Languages.product.tips[3]}</Text>
                        </Touchable>
                    </View>
                    <View style={styles.rowGuide}>
                        <Touchable style={styles.itemUtility} onPress={onHtmlViewTLuy}>
                            <IcPackage />
                            <Text style={styles.txtUtility}>{Languages.product.tips[1]}</Text>
                        </Touchable>
                        <Touchable style={styles.itemUtility} onPress={onHtmlViewTuiUni}>
                            <IcUnlimited />
                            <Text style={styles.txtUtility}>{Languages.product.tips[2]}</Text>
                        </Touchable>
                    </View>
                </ScrollView>
                {renderPopups}
            </View>
        </NotifyListener>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingTop: 20,
    },
    headerContainer: {
        backgroundColor: COLORS.RED_5,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingBottom: 10,
        paddingTop: 50,
    },
    headerContent: {
        flex: 1,
        justifyContent: "space-between",
    },
    circle: {
        width: 190,
        height: 190,
        borderRadius: 125,
        backgroundColor: COLORS.RED,
        position: "absolute",
        left: -30,
        top: -20,
    },
    circle2: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: COLORS.RED,
        position: "absolute",
        right: -60,
        top: -55,
    },
    wrapInfo: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 30,
        overflow: "hidden",
    },
    wrapAvatarImage: {
        width: 40,
        height: 40,
        borderWidth: 2,
        borderRadius: 20,
        marginRight: 10,
        borderColor: COLORS.WHITE,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
    },
    wrapAvatar: {
        width: 40,
        height: 40,
    },
    txtWelcome: {
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
    },
    txtSession: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size15,
    },
    txtName: {
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size20,
        fontFamily: Configs.FontFamily.medium,
        width: SCREEN_WIDTH * 0.75,
    },
    tipContainer: {
        ...Styles.shadow,
        borderRadius: 10,
        marginHorizontal: 15,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    wrapInfoText: {
        alignItems: "flex-start",
    },
    iconBell: {
        marginBottom: 5,
    },
    txtHeader: {
        fontSize: Configs.FontSize.size20,
        marginLeft: 16,
        marginTop: 20,
        marginBottom: 10,
        color: COLORS.BLACK,
        fontFamily: Configs.FontFamily.bold,
    },
    wrapProduct2: {
        ...Styles.shadow,
        marginHorizontal: 16,
        borderRadius: 10,
        marginBottom: 15,
    },
    itemProduct: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 13,
        paddingVertical: 10,
        borderBottomColor: COLORS.GRAY_1,
        alignItems: "center",
        marginRight: 14,
    },
    lastItemProduct: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
        alignItems: "center",
        paddingHorizontal: 13,
        marginRight: 14,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    containerInfo: {
        borderRadius: 16,
        paddingHorizontal: 10,
        backgroundColor: COLORS.GRAY_10,
        paddingVertical: 10,
        marginHorizontal: 16,
        borderColor: COLORS.GRAY_7,
        borderWidth: 1,
    },
    txtSecurity: {
        fontSize: Configs.FontSize.size12,
        fontFamily: Configs.FontFamily.medium,
        marginLeft: 8,
        color: COLORS.BLACK_PRIMARY,
    },
    rowItem: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
    },
    itemInfo: {
        alignItems: "center",
        justifyContent: "space-between",
        width: (SCREEN_WIDTH - 32) / 5,
    },
    txtItemInfo: {
        fontSize: Configs.FontSize.size12,
        marginTop: 5,
        fontFamily: Configs.FontFamily.bold,
    },
    border: {
        borderRadius: 50,
        borderWidth: 1,
        borderColor: COLORS.RED,
        padding: 5,
    },
    itemUtility: {
        ...Styles.shadow,
        width: (SCREEN_WIDTH - 52) / 2,
        paddingVertical: 20,
        backgroundColor: COLORS.WHITE,
        alignItems: "center",
        borderRadius: 10,
        marginVertical: 10,
    },
    txtUtility: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        marginTop: 10,
    },
    txtTitle: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size15,
        color: COLORS.GRAY_16,
    },
    wrapText: {
        marginLeft: 10,
        flex: 1,
    },
    wrapCount: {
        width: 16,
        height: 16,
        backgroundColor: COLORS.WHITE,
        borderRadius: 8,
        position: "absolute",
        top: -10,
        right: -10,
        justifyContent: "center",
        alignItems: "center",
    },
    wrapBell: {
        marginRight: 10,
        paddingLeft: 10,
        position: "absolute",
        top: 15,
        right: -5,
    },
    txtNotify: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size8,
        color: COLORS.RED,
    },
    btn: {
        width: SCREEN_WIDTH / 2 - Configs.IconSize.size40,
        marginTop: 10,
        marginHorizontal: 5,
    },
    rowGuide: {
        flexDirection: "row",
        marginHorizontal: 16,
        justifyContent: "space-between",
    },
    wrapChildProduct: {
        paddingHorizontal: 24,
    },
    popupNotifyContainer: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        flexDirection: "row",
        marginRight: 0,
    }
});
export default Product;
