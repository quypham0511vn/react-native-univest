import { observer } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import GopY from '@/assets/images/ic_comment.svg';
import IcZalo from '@/assets/images/ic_zalo.png';
import IcFacebook from '@/assets/images/ic_facebook.png';
import Question from '@/assets/images/ic_question_circle.svg';
import RightIcon from '@/assets/images/ic_right.svg';
import Feedback from '@/assets/images/ic_support_circle.svg';
import Manual from '@/assets/images/ic_warning.svg';
import Policy from '@/assets/images/ic_policy.svg';
import { Configs, isIOS } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar, Touchable } from '@/components';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { API_CONFIG, LINK } from '@/api/constants';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import { useAppStore } from '@/hooks';
import Utils from '@/utils/Utils';

const Help = observer(() => {
    const { userManager } = useAppStore();

    const getTicketLink = useCallback(() => {
        if (userManager.userInfo) {
            return `${LINK.TICKET}?usp=pp_url&entry.1034731909=${userManager.userInfo.full_name}&entry.486370795=${userManager.userInfo.phone}&entry.1358644655=${userManager.userInfo.email}}`;
        }
        return LINK.TICKET;
    }, [userManager.userInfo]);

    const getFeedbackLink = useCallback(() => {
        if (userManager.userInfo) {
            return `${LINK.FEEDBACK}?usp=pp_url&entry.728863708=${userManager.userInfo.phone}&entry.2087307631=${userManager.userInfo.email}`;
        }
        return LINK.FEEDBACK;
    }, [userManager.userInfo]);

    const renderItem = useCallback((icon: any, title: string, textRight?: string) => {
        const onNavigate = () => {
            switch (title) {
                // case Languages.support.createRequest:
                //     Navigator.pushScreen(ScreenNames.myWebview, {
                //         title,
                //         url: getTicketLink()
                //     });
                //     break;
                case Languages.support.contactFanPage:
                    Utils.openURL(isIOS ? LINK.FAN_PAGE_IOS : LINK.FAN_PAGE_ANDROID);
                    break;
                case Languages.support.contactZalo:
                    Utils.openURL(LINK.ZALO);
                    break;
                case Languages.support.manual:
                    Navigator.pushScreen(ScreenNames.myWebview, {
                        title: Languages.common.news,
                        url: API_CONFIG.WEB_URL + LINK.USE_MANUAL
                    });
                    break;
                case Languages.support.question:
                    Navigator.pushScreen(ScreenNames.myWebview, {
                        title: Languages.common.news,
                        url: API_CONFIG.WEB_URL + LINK.QUESTIONS
                    });
                    break;
                case Languages.support.feedBack:
                    Navigator.pushScreen(ScreenNames.myWebview, {
                        title,
                        url: getFeedbackLink()
                    });
                    break;
                case Languages.support.policy:
                    Navigator.pushScreen(ScreenNames.myWebview, {
                        title,
                        url: LINK.POLICY
                    });
                    break;
                default:
                    break;
            }
        };
        return (
            <Touchable onPress={onNavigate} radius={25} style={styles.item}>
                <View style={styles.rowItem}>
                    <View style={styles.circleIcon}>{icon}</View>
                    <Text style={styles.txtSupport}>{title}</Text>
                    <Text style={styles.textRight}>{textRight}</Text>
                </View>
                <RightIcon />
            </Touchable>
        );
    }, [getFeedbackLink]);

    useEffect(() => {
        AnalyticsUtils.trackScreen(ScreenNames.help);
    }, []);

    return (
        <View style={styles.container}>
            <HeaderBar
                title={Languages.support.title} />
            <View style={styles.column}>
                <View style={styles.wrapSupport}>
                    {renderItem(<Image style={styles.centerImg} source={IcFacebook} />, Languages.support.contactFanPage)}
                    {renderItem(<Image style={styles.centerImg} source={IcZalo} />, Languages.support.contactZalo)}
                    {/* {renderItem(<Feedback />, Languages.support.createRequest)} */}
                </View>
                <View style={styles.wrapSupport}>
                    {renderItem(<Manual />, Languages.support.manual)}
                    {renderItem(<Question />, Languages.support.question)}
                    {renderItem(<GopY />, Languages.support.feedBack)}
                    {renderItem(<Policy />, Languages.support.policy)}
                </View>
            </View>
            <Text style={styles.textVersion}>{'Phiên bản 1.4.20230113'}</Text>
        </View>
    );
});
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between'
    },
    column: {
        flex: 1,
        flexDirection:'column'
    },
    wrapSupport: {
        ...Styles.shadow,
        paddingTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 15,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 20
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    txtSupport: {
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK_PRIMARY,
        fontFamily: Configs.FontFamily.medium,
        marginLeft: 20,
        flex: 1
    },
    textRight: {
        ...Styles.typography.medium,
        marginRight: 10
    },
    item: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderColor: COLORS.GRAY_2,
        paddingRight: 15
    },
    circleIcon: {
        width: 32,
        height: 32,
        borderColor: COLORS.RED_2,
        borderWidth: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerImg: {
        width: 35,
        height: 35
    },
    textVersion: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size10,
        textAlign: 'right',
        paddingBottom: 5,
        paddingHorizontal: 5
    }
});
export default Help;
