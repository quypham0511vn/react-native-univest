import { observer } from "mobx-react";

import ScreenNames from "@/commons/ScreenNames";
import AnalyticsUtils from "@/utils/AnalyticsUtils";

import CTVIcon from "@/assets/images/ctv.svg";
import GDIcon from "@/assets/images/giaodich.svg";
import IcGift from '@/assets/images/ic_gift.svg';
import KhacIcon from "@/assets/images/khac.svg";
import HTIcon from "@/assets/images/thongbao.svg";
import { Configs, PAGE_SIZE } from "@/commons/Configs";
import { NOTIFICATION_TYPE } from "@/commons/constants";
import Languages from "@/commons/Languages";
import { HeaderBar, Touchable } from "@/components";
import FilterTemplate from "@/components/FilterTemplate";
import MyLoading from "@/components/MyLoading";
import NoData from "@/components/NoData";
import PopupStatus from "@/components/popupStatus/PopupStatus";
import { PopupActions } from '@/components/popupStatus/types';
import { useAppStore } from "@/hooks";
import { KeyValueModel } from "@/models/key-value";
import { ExtraData, NotificationPopupModel } from "@/models/notification-popup";
import { NotificationModel } from "@/models/notify";
import { NotificationCategory } from "@/models/notify-category";
import Navigator from "@/routers/Navigator";
import { COLORS, Styles } from "@/theme";
import { PagingConditionTypes } from "@/types/paging";
import DateUtils from "@/utils/DateUtils";
import ToastUtils from "@/utils/ToastUtils";
import { useIsFocused } from "@react-navigation/native";
import React, {
    useCallback, useEffect, useMemo,
    useRef,
    useState
} from "react";
import {
    ScrollView, SectionList, StyleSheet,
    Text,
    View
} from "react-native";
import SwipeableItem from "react-native-swipeable-item";

const NotificationType = {
    HE_THONG: 1,
    GIAO_DICH: 2,
    CTV: 3,
    KHAC: 4
}

const Notification = observer(() => {
    const { apiServices, userManager } = useAppStore();

    const rawNotificationsRef = useRef<NotificationPopupModel[]>([]);
    const [groupNotifications, setGroupNotifications] = useState<NotificationModel[]>([]);
    const [isLoadingUI, setLoadingUI] = useState<boolean>(true);
    const [canLoadMoreUI, setCanLoadMoreUI] = useState<boolean>(false);
    const isFocused = useIsFocused();
    const [category, setCategory] = useState<NotificationCategory[]>([]);

    const invitePopupRef = useRef<PopupActions>(null);
    const lastNotificationData = useRef<NotificationPopupModel>();
    const lastExtraData = useRef<ExtraData>();

    const condition = useRef<PagingConditionTypes>({
        isLoading: true,
        canLoadMore: true,
        offset: 0,
        startDate: undefined,
        endDate: undefined,
    });
    const [selectedFilter, setSelectedFilter] = useState<number>(-1);
    

    const getCategory = useCallback(async () => {
        const res = await apiServices.notify.getNotifyCategory();
        if (res && res.status == 200 && res.data) {
            const data = res.data as NotificationCategory[];
            setCategory(data);
            if (data.length > 0) {
                setSelectedFilter(data[0].id);
            }
        }
    }, [apiServices.notify]);

    // group value by created_at in array newNotifications.items
    const groupBy = (array: any, key: any) => {
        return array.reduce((result: any, currentValue: any) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            return result;
        }, {});
    };

    useEffect(() => {
        AnalyticsUtils.trackScreen(ScreenNames.transactions);
        getCategory();
    }, []);

    const fetchData = useCallback(
        async (isLoadMore?: boolean) => {
            condition.current.isLoading = true;
            if (!isLoadMore) {
                setLoadingUI(condition.current.isLoading);
            }
            const res = await apiServices.notify.getNotify(
                isLoadMore ? condition.current.offset : 1,
                PAGE_SIZE,
                selectedFilter
            );

            const newData = res.data as NotificationModel;
            const newNotifications: NotificationPopupModel[] = newData.items || [];
            const newSize = newNotifications?.length;

            if (newSize > 0) {
                condition.current.offset = isLoadMore ? condition.current.offset + newSize : newSize;

                if (isLoadMore) {
                    rawNotificationsRef.current.push(...newNotifications);
                } else {
                    rawNotificationsRef.current = newNotifications;
                }
            } else if (!res.success || !isLoadMore) {
                rawNotificationsRef.current = [];
            }

            const result = groupBy(newNotifications.map((e: any) => {
                e.notification_date = DateUtils.formatUnixTimestampToDate(e.created_at);
                return e;
            }), "notification_date");

            // map data to array
            const data = Object.keys(result).map((key) => ({
                title: DateUtils.formatUnixTimestampToDate(result[key][0].created_at),
                data: result[key],
            }));

            setGroupNotifications(data);

            condition.current.isLoading = false;
            condition.current.canLoadMore = newSize >= PAGE_SIZE;
            if (!isLoadMore) {
                setLoadingUI(condition.current.isLoading);
            }
            setCanLoadMoreUI(condition.current.canLoadMore);
        },
        [apiServices.notify, selectedFilter]
    );

    useEffect(() => {
        if (isFocused && selectedFilter >= 0) {
            onRefresh();
        }
    }, [selectedFilter]);

    const renderFilterTemplate = useCallback(
        (item: KeyValueModel) => {
            let selected = false;
            if (item.id === selectedFilter) {
                selected = true;
            }

            const _onPress = () => {
                setSelectedFilter(item.id);
            };
            return (
                <FilterTemplate
                    key={item?.id}
                    style={styles.filterItem}
                    item={item}
                    onPress={_onPress}
                    selected={selected}
                />
            );
        }, [selectedFilter]);

    const renderFooter = useMemo(() => {
        return <View>{canLoadMoreUI && <MyLoading />}</View>;
    }, [canLoadMoreUI]);

    const renderNoData = useMemo(() => {
        return !isLoadingUI && groupNotifications.length === 0 ? (
            <NoData description={Languages.notification.noData} hasImage={false} />
        ) : null;
    }, [isLoadingUI, groupNotifications.length]);

    const renderFilter = useMemo(() => {
        return (
            <View style={styles.filter}>
                <ScrollView
                    style={styles.filterContainer}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                >
                    {category?.map(renderFilterTemplate)}
                </ScrollView>
            </View>
        );
    }, [renderFilterTemplate, category]);

    const keyTransactionExtractor = useCallback((item: any, index: number) => {
        return `${index}${item.id}`;
    }, []);

    const needShowPopupCTV = useCallback((item: NotificationPopupModel) => {
        let isInvitation = false;
        if (item.extra && item.extra.length > 0) {
            for (let index = 0; index < item.extra.length; index++) {
                if (item.extra[index].type === NOTIFICATION_TYPE.INVITE_PARTNER) {
                    lastExtraData.current = item.extra[index];
                    isInvitation = true;
                    break;
                }
            }
        }
        lastNotificationData.current = item;
        if (isInvitation) {
            invitePopupRef.current?.showCustom?.(item.title, item.body);
            return true
        } else {
            return false
        }
    }, [userManager.userInfo?.is_ctv]);

    const onUpdateStatus = useCallback(async (item: NotificationPopupModel) => {
        const res = await apiServices.notify.updateNotify(item.id);
        if (res.ok) {
            setGroupNotifications(last => last.map((group) => {
                group.data?.map(notification => {
                    if (notification.id == item.id) {
                        notification.last_seen = 1;
                    }
                    return notification;
                })
                return group;
            }))
        }
    }, [apiServices.notify]);

    const onAcceptInvite = useCallback(async () => {
        invitePopupRef.current?.hide();
        if (lastExtraData.current && lastNotificationData.current) {
            const res = await apiServices.auth.responseInvite(lastExtraData.current.value, true);
            if (res.success && res.message) {
                ToastUtils.showSuccessToast(res.message);
                userManager.updateUserInfo({
                    ...userManager?.userInfo,
                    is_ctv: true
                });
                onUpdateStatus(lastNotificationData.current);
            }
            lastExtraData.current = undefined;
            lastNotificationData.current = undefined;
        }
    }, [apiServices.auth, userManager]);

    const goToDetail = (item: NotificationPopupModel) => {
        if (item.last_seen === 0) {
            if (needShowPopupCTV(item)) {
                return;
            } else {
                onUpdateStatus(item);
            }
        }
        Navigator.navigateScreen(ScreenNames.NotificationDetail, {
            notifyId: item.id,
            title: item.title
        });
    };

    const onEndReached = useCallback(() => {
        if (!condition.current.isLoading && condition.current.canLoadMore) {
            fetchData(true);
        }
    }, [fetchData]);

    const onRefresh = useCallback(
        (startDate?: Date, endDate?: Date) => {
            condition.current.canLoadMore = true;
            condition.current.offset = 0;
            condition.current.startDate = startDate;
            condition.current.endDate = endDate;
            fetchData();
        },
        [fetchData]
    );

    const renderIcon = (type: number) => {
        let icon: any = "";
        switch (type) {
            case NotificationType.HE_THONG:
                icon = <HTIcon />;
                break;
            case NotificationType.GIAO_DICH:
                icon = <GDIcon />;
                break;
            case NotificationType.CTV:
                icon = <CTVIcon />;
                break;
            case NotificationType.KHAC:
            default:
                icon = <KhacIcon />;
                break;
        }
        return icon;
    };

    const renderNotifications = useMemo(() => {
        const Item = ({ item }: { item: NotificationPopupModel }) => {
            const unRead = item.last_seen === 0

            return <SwipeableItem
                item={item}>
                <Touchable
                    style={styles.sectionContainer}
                    onPress={() => goToDetail(item)}
                >
                    {renderIcon(item.category_id)}
                    <View style={styles.notificationItemTitle}>
                        <Text
                            style={unRead ? styles.textTitleNotRead : styles.textTitle} >
                            {item.title}
                        </Text>
                        <Text style={unRead ? styles.textTimeUnRead : styles.textTime}>
                            {DateUtils.formatUnixTimestampToFullDate(item.created_at)}
                        </Text>
                        <View style={styles.bottomItem}>
                            <Text style={unRead ? styles.descriptionUnRead : styles.description}>{item.description}</Text>
                        </View>
                    </View>
                    {unRead && <Text style={styles.dot}> {'•'}</Text>}
                </Touchable>
            </SwipeableItem>
        }

        return (
            <>
                <SectionList
                    sections={groupNotifications}
                    keyExtractor={(item: any, index) => item + index}
                    renderItem={({ item }: any) => <Item item={item} />}
                    renderSectionHeader={({ section: { title } }) => (
                        <Text style={styles.header}>{title}</Text>
                    )}
                    refreshing={isLoadingUI}
                    onRefresh={onRefresh}
                    ListFooterComponent={renderFooter}
                    ListHeaderComponent={renderNoData}
                />
            </>
        );
    }, [isLoadingUI, keyTransactionExtractor, onEndReached, onRefresh, renderFooter, renderNoData, groupNotifications]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.notification.title}
            />
            {renderFilter}
            {renderNotifications}

            <PopupStatus
                ref={invitePopupRef}
                icon={<IcGift />}
                isIcon
                hasButton
                onSuccessPress={onAcceptInvite}
            />
        </View>
    );
});

export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 10,
    },
    sectionContainer: {
        ...Styles.shadow,
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignContent: "center",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    detailSection: {
        flex: 1,
        justifyContent: "space-between",
        marginLeft: 10,
    },
    sectionTxt: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size15,
    },
    desTxt: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size12,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginTop: 10,
        alignItems: "center",
    },
    cardContent: {
        marginLeft: 10,
    },
    filterContainer: {},
    filter: {
        flexDirection: "row",
        marginTop: 15,
        height: Configs.FontSize.size40,
        paddingLeft: 4,
    },
    filterItem: {
        paddingHorizontal: 10,
        marginHorizontal: 5,
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        textAlign: "center",
    },
    wrapRight: {
        ...Styles.shadow,
        flex: 1,
        alignItems: "flex-end",
        backgroundColor: COLORS.WHITE,
        alignSelf: "flex-end",
        marginTop: 10,
        width: 100,
        marginRight: 10,
        borderRadius: 10,
        justifyContent: "center",
        paddingRight: 16,
    },
    txtCancel: {
        ...Styles.typography.bold,
        color: COLORS.RED,
        fontSize: Configs.FontSize.size16,
    },
    textTime: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12,
    },
    textTimeUnRead: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size12,
    },
    dot: {
        color: COLORS.RED,
        fontSize: Configs.FontSize.size12,
    },
    textTitle: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size14,
        flex: 1,
        color: COLORS.GRAY_11,
    },
    textTitleNotRead: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size14,
        flex: 1,
        color: COLORS.BLACK_1,
    },
    bottomItem: {
        marginTop: 5,
    },
    header: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size12,
        textAlign: "left",
        marginLeft: 16,
        color: COLORS.BLACK,
        marginBottom: 8,
        marginTop: 8,
    },
    title: {
        fontSize: Configs.FontSize.size12,
    },
    description: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        flex: 1,
        color: COLORS.GRAY,
    },
    descriptionUnRead: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size14,
        flex: 1,
        color: COLORS.BLACK,
    },
    notificationItemTitle: {
        marginLeft: 10,
        flex: 1
    }
});

