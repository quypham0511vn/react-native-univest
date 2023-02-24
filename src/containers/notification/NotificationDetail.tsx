import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { PADDING_BOTTOM } from '@/commons/Configs';
import { NOTIFICATION_TYPE } from '@/commons/constants';
import Languages from '@/commons/Languages';
import { TabNamesMatch } from '@/commons/ScreenNames';
import { Button, HeaderBar } from '@/components';
import { MyImageView } from '@/components/image';
import { useAppStore } from '@/hooks';
import { ExtraData, NotificationPopupModel } from '@/models/notification-popup';
import Navigator from '@/routers/Navigator';
import { COLORS } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import NotificationBody from './NotificationBody';

const NotificationDetail = ({ route }: any) => {
    const { apiServices } = useAppStore();
    const webProgressRef = useRef(null);

    const { notifyId, title } = route.params;
    const [notifyData, setNotifyData] = useState<NotificationPopupModel>();

    useEffect(() => {
        getNotificationDetail(notifyId);
    }, [notifyId]);

    const getNotificationDetail = async (id: number) => {
        const res: any = await apiServices.notify.getNotifyDetail(id);
        if (res.success) {
            setNotifyData(res?.data);
        }
    };

    const onPress = useCallback((extraData: ExtraData) => {
        switch (extraData.type) {
            case NOTIFICATION_TYPE.EXTERNAL_LINK:
                Utils.openURL(extraData.value);
                break;
            case NOTIFICATION_TYPE.MOVE_SCREEN_APP:
                let extraInfo: ExtraData | undefined = undefined;
                if (notifyData && notifyData.extra && notifyData.extra.length > 0) {
                    for (let index = 0; index < notifyData.extra.length; index++) {
                        if (notifyData.extra[index].type === NOTIFICATION_TYPE.EXTRA_INFO) {
                            extraInfo = notifyData.extra[index];
                            break;
                        }
                    }
                }

                if (extraData.value) {
                    if (extraData.value.includes(',')) {
                        const screens = extraData.value?.split(',')
                        if (screens.length === 2) {
                            let stack: keyof typeof TabNamesMatch = 'homeTab'

                            Object.keys(TabNamesMatch).map((key: any) => {
                                if (key === screens[0]) {
                                    stack = key;
                                }
                            })
                            Navigator.navigateToDeepScreen([TabNamesMatch[stack]], screens[1], extraInfo);
                        }
                    } else {
                        Navigator.navigateScreen(extraData.value, extraInfo);
                    }
                }

                break;
        }
    }, [notifyData]);

    return (
        <View style={styles.mainContainer}>
            <HeaderBar
                hasBack
                title={title || Languages.notification.detail_title}
            />

            {notifyData?.popup_image && <MyImageView
                imageUrl={notifyData.popup_image}
                style={styles.image}
            />}

            <View style={styles.body}>
                <NotificationBody
                    content={notifyData?.body} />
            </View>
            {notifyData?.extra?.map(item => {
                switch (item.type) {
                    case NOTIFICATION_TYPE.EXTERNAL_LINK:
                    case NOTIFICATION_TYPE.MOVE_SCREEN_APP:
                        return <Button
                            key={item.type}
                            style={styles.btn}
                            label={item.text}
                            onPress={() => onPress(item)}
                            buttonStyle={'RED'}
                        />
                    default:
                        return null;
                }
            })}
        </View>
    );
};

export default NotificationDetail;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM,
        backgroundColor: COLORS.WHITE
    },
    body: {
        marginHorizontal: 10,
        paddingBottom: 20,
        flex: 1,
    },
    btn: {
        marginHorizontal: 10,
        marginBottom: 10
    },
    image: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH / 16 * 9,
    },
});
