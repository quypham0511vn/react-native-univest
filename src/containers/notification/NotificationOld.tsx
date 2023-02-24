import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { toJS } from 'mobx';

import { Configs, PADDING_BOTTOM, PAGE_SIZE } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import MyFlatList from '@/components/MyFlatList';
import MyLoading from '@/components/MyLoading';
import { useAppStore } from '@/hooks';
import { NotificationModel } from '@/models/notify';
import DateUtils from '@/utils/DateUtils';
import { COLORS, HtmlStyles, Styles } from '@/theme';
import PopupStatus from '@/components/popupStatus/PopupStatus';
import { NOTIFICATION_TYPE } from '@/commons/constants';
import IcGift from '@/assets/images/ic_gift.svg';
import { PopupActions } from '@/components/popupStatus/types';
import ToastUtils from '@/utils/ToastUtils';

const NotificationOld = observer(() => {
    const { apiServices, userManager } = useAppStore();

    const [listNotify, setNotifications] = useState<NotificationModel[]>([]);
    const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
    const [canLoadMore, setLoadMore] = useState<boolean>(true);
    const [lastId, setLastId] = useState<number>(0);
    const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState<boolean>(true);
    const invitePopupRef = useRef<PopupActions>(null);
    const lastNotificationObj = useRef<any>();

    const pageSize = PAGE_SIZE;

    const fetchData = useCallback(async (isLoadMore?: boolean) => {
        const res = await apiServices.notify.getNotifyOld(isLoadMore ? lastId : 0, pageSize);

        const newNotifications = res.data as NotificationModel[];

        if (newNotifications?.length > 0) {
            setLastId(last => last + newNotifications.length);

            if (isLoadMore) {
                setNotifications(last => [...last, ...newNotifications]);
            } else {
                setNotifications(newNotifications);
            }
        }
        setLoadMore(newNotifications?.length >= pageSize);
    }, [apiServices.notify, lastId, pageSize]);

    useEffect(() => {
        fetchData();
    }, []);

    const keyExtractor = useCallback((item: NotificationModel) => {
        return `${item.id}`;
    }, []);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        fetchData();
        setIsRefreshing(false);
    }, []);

    const onAcceptInvite = useCallback(async () => {
        invitePopupRef.current?.hide();
        if (lastNotificationObj.current) {
            const res = await apiServices.auth.responseInvite(lastNotificationObj.current.user_partner_id, true);
            lastNotificationObj.current = undefined;
            if (res.success && res.message) {
                ToastUtils.showSuccessToast(res.message);
                userManager.updateUserInfo({
                    ...userManager?.userInfo,
                    is_ctv: true
                });
            }
        }
    }, [apiServices.auth, userManager]);

    const needShowCTV = useCallback((item: any) => {
        return item.action === NOTIFICATION_TYPE.INVITE_PARTNER && !userManager.userInfo?.is_ctv;
    }, [userManager.userInfo?.is_ctv]);

    const onUpdateStatus = useCallback(async (item: any) => {
        if (needShowCTV(item)) {
            invitePopupRef.current?.showCustom?.(item.note, item.message);
            lastNotificationObj.current = item;
        }

        const res = await apiServices.notify.updateNotifyOld(item.id);
        if (res.success) {
            setNotifications(last => last.map(_item => {
                if (_item.id === item.id) {
                    _item.status = 2;
                }
                return _item;
            }));
        }
    }, [apiServices.notify, needShowCTV]);

    const renderFooter = useMemo(() => {
        return <View>
            {canLoadMore && <MyLoading />}
        </View>;
    }, [canLoadMore]);

    const onMomentumScrollBegin = useCallback(() => {
        setOnEndReachedCalledDuringMomentum(false);
    }, []);

    const onEndReached = useCallback(() => {
        if (canLoadMore) {
            fetchData(true);
        }
    }, [canLoadMore, fetchData]);

    const renderListNotify = useCallback(({ item }: { item: any }) => {
        const unread = item.status === 1 || needShowCTV(item);

        const onPress = () => {
            onUpdateStatus(item);
        };

        return (
            <Touchable style={unread ? styles.itemNotifyUnread : styles.itemNotifyRead}
                disabled={!unread}
                onPress={onPress}>
                <Text style={styles.textTime}>{DateUtils.getDateByLong(item.created_at)}</Text>
                <Text style={styles.textTitle}>{item.note}</Text>
                <View style={styles.bottomItem}>
                    <HTMLView
                        stylesheet={HtmlStyles || undefined}
                        value={`<p>${item.message}</p>`}
                    />
                </View>
            </Touchable >
        );
    }, [needShowCTV, onUpdateStatus]);

    const renderEmptyData = useMemo(() => {
        return (
            !canLoadMore ? <Text style={styles.textEmpty}>{Languages.notification.noNotify}</Text> : null
        );
    }, [canLoadMore]);

    const renderList = useMemo(() => {
        return <MyFlatList
            style={styles.contentContainer}
            data={listNotify}
            renderItem={renderListNotify}
            showsHorizontalScrollIndicator={false}
            ListFooterComponent={renderFooter}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            onEndReached={onEndReached}
            onMomentumScrollBegin={onMomentumScrollBegin}
            onEndReachedThreshold={0.01}
            ListEmptyComponent={renderEmptyData}
            {... { keyExtractor }}
        />;
    }, [listNotify, renderListNotify, renderFooter, isRefreshing, onRefresh, onEndReached, onMomentumScrollBegin, renderEmptyData, keyExtractor]);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.notification.title} />
            {renderList}

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

export default NotificationOld;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    contentContainer: {
        flex: 1,
        marginTop: 15,
        paddingBottom: PADDING_BOTTOM
    },
    itemNotifyRead: {
        ...Styles.shadow,
        backgroundColor: COLORS.GRAY_13,
        marginBottom: 10,
        padding: 12,
        borderRadius: 5,
        marginHorizontal: 15
    },
    itemNotifyUnread: {
        ...Styles.shadow,
        marginBottom: 10,
        padding: 12,
        borderRadius: 5,
        marginHorizontal: 15
    },
    topItem: {
        borderBottomWidth: 1,
        borderBottomColor: COLORS.GRAY_2,
        paddingBottom: 10,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    textTitle: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size15,
        flex: 1,
        color: COLORS.BLACK
    },
    textTime: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12
    },
    bottomItem: {
        marginTop: 5
    },
    textEmpty: {
        textAlign: 'center',
        marginVertical: 15
    }
});
