import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';

import IcConvert from '@/assets/images/ic_convert.svg';
import IcWithdraw from '@/assets/images/ic_money.svg';
import IcPlus from '@/assets/images/ic_plus.svg';
import IcWarning from '@/assets/images/ic_warning_filled.svg';
import { Configs } from '@/commons/Configs';
import { Convert, ENUM_STATUS_KYC, MIN_MONEY, ZERO } from '@/commons/constants';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { Touchable } from '@/components';
import PopupKYC from '@/components/PopupKYC';
import PopupStatus from '@/components/popupStatus/PopupStatus';
import { PopupActions } from '@/components/popupStatus/types';
import { useAppStore } from '@/hooks';
import { AssetsModelData } from '@/models/assets';
import { ProductModel } from '@/models/product';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Utils from '@/utils/Utils';
import AssetDetailComponent from './AssetDetailComponent';

const Card = ({ data, hasTopUp, title, renderContent, idContract, isUnlimited, packageId,
    hasWithdraw, hasConvert, onFilterChanged, contract }:
    {
        data?: AssetsModelData, hasTopUp?: boolean, title: string, isUnlimited?: boolean, onFilterChanged: () => any,
        renderContent?: any, idContract?: number, hasWithdraw?: boolean, packageId?: number, hasConvert?: boolean, contract?: ProductModel
    }) => {
    const { userManager } = useAppStore();
    const popup = useRef<PopupActions>();
    const popupKYC = useRef<PopupActions>();

    const onTopUp = useCallback(() => {
        if (isUnlimited || idContract) {
            Navigator.pushScreen(ScreenNames.topUp, { isInvest: false, isUnlimited, id: isUnlimited ? packageId : idContract, contract });
        } else {
            Navigator.pushScreen(ScreenNames.investAccumulate, { isInvest: false, isUnlimited, contract });
        }
    }, [idContract, isUnlimited, contract]);

    const renderCard = useMemo(() => {
        return <View style={styles.cardContainer}>
            <View style={styles.circleContainer}>
                <View style={styles.circle1} />
                <View style={styles.circle2} />
            </View>
            <Text style={styles.header}>
                {title}
            </Text>

            <View style={styles.row}>
                <Text style={styles.money}>
                    {Utils.formatMoney(data?.total_money_all)}
                </Text>
                <Text style={styles.unit}>
                    {Languages.common.currency}
                </Text>
            </View>

            {renderContent}
            <AssetDetailComponent
                data={data}
                isCard
                isUnlimited
                onFilterChanged={onFilterChanged}
            />
        </View>;
    }, [data, onFilterChanged, renderContent, title]);

    const onAgreeKYC = useCallback(() => {
        popupKYC.current?.hide();
        if (userManager?.userInfo?.accuracy === ENUM_STATUS_KYC.NOT_YET || userManager?.userInfo?.accuracy === ENUM_STATUS_KYC.FAIL) {
            Navigator.navigateScreen(ScreenNames.identifyConfirm);
        }
    }, [userManager?.userInfo?.accuracy]);

    const renderButton = useCallback((label: string, icon: any, screen: any) => {
        const _onPress = () => {
            const onNavigate = () => Navigator.pushScreen(screen, {
                isInvest: false, id: idContract, isConvert: true,
                packageId, money: data?.total_money_all, isUnlimited, contract
            });
            const accuracy = userManager.userInfo?.accuracy;
            switch (label) {
                case Languages.assets.withdraw:
                    if (accuracy !== ENUM_STATUS_KYC.SUCCESS) {
                        popupKYC.current?.show();
                    } else if (data?.total_money_all.split(Languages.common.currency).join('') !== ZERO &&
                        Number(data?.total_money_all.split(Languages.common.currency).join('').split('.').join('')) >= MIN_MONEY) {
                        onNavigate();
                    } else
                        popup.current?.show();
                    break;
                case Languages.assets.topUp:
                    onTopUp();
                    break;
                default:
                    onNavigate();
                    break;
            }
        };

        return <Touchable style={styles.button}
            onPress={_onPress}>
            {icon}
            <Text style={Styles.typography.regular}>
                {label}
            </Text>
        </Touchable>;
    }, [data?.total_money_all, idContract, isUnlimited, onTopUp, packageId, contract, userManager.userInfo?.accuracy]);

    const renderButtons = useMemo(() => {
        return <View style={styles.btnContainer}>
            {hasTopUp && renderButton(Languages.assets.topUp, <IcPlus />, ScreenNames.topUp)}
            {/* {renderButton(Languages.assets.convert, <IcConvert />, ScreenNames.convertScreen)} */}
            {hasWithdraw && renderButton(Languages.assets.withdraw, <IcWithdraw />, ScreenNames.withdraw)}
            {hasConvert && renderButton(Languages.assets.invest, <IcConvert />, ScreenNames.investAccumulate)}
        </View>;
    }, [hasConvert, hasTopUp, hasWithdraw, renderButton]);

    const renderPopup = useCallback((ref: any, titlePopup: string, description: string) => {
        return <PopupStatus
            ref={ref}
            title={titlePopup}
            description={description}
            hasButton={false}
            icon={<IcWarning />}
            isIcon
        />;
    }, []);

    const renderPopupKYC = useCallback((ref?: any, titlePopup?: string, content?: string) => {
        return <PopupKYC
            ref={ref}
            content={content}
            title={titlePopup}
            onConfirm={onAgreeKYC}
            hasButton={(userManager?.userInfo?.accuracy !== ENUM_STATUS_KYC.WAIT)}
        />;
    }, [onAgreeKYC, userManager?.userInfo?.accuracy]);

    return <>
        {renderCard}

        {renderButtons}
        <Dash
            style={styles.dash}
            dashThickness={1}
            dashLength={10}
            dashGap={5}
            dashColor={COLORS.GRAY_7} />

        {renderPopup(popup, Languages.notification.title, Languages.errorMsg.errNoEnoughMoney)}
        {renderPopupKYC(popupKYC, `${Languages.notification.title}${userManager?.userInfo?.accuracy === ENUM_STATUS_KYC.WAIT ? Languages.errorMsg.waitKYC : Languages.errorMsg.notKYc}`, userManager?.userInfo?.accuracy === ENUM_STATUS_KYC.WAIT ? Languages.errorMsg.waitMesKYC : Languages.errorMsg.errKYC)}
    </>;
};

export default Card;

const RADIUS_CIRCLE = SCREEN_WIDTH / 5 * 4;

const styles = StyleSheet.create({
    cardContainer: {
        ...Styles.shadow,
        paddingHorizontal: 10,
        paddingTop: 15,
        marginHorizontal: 15,
        marginTop: 25,
        borderRadius: 10
    },
    circleContainer: {
        overflow: 'hidden',
        position: 'absolute',
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        borderRadius: 10
    },
    circle1: {
        position: 'absolute',
        right: -RADIUS_CIRCLE / 2,
        top: -20,
        width: RADIUS_CIRCLE,
        height: RADIUS_CIRCLE,
        borderRadius: RADIUS_CIRCLE / 2,
        backgroundColor: COLORS.PINK
    },
    circle2: {
        position: 'absolute',
        bottom: -RADIUS_CIRCLE / 1.5,
        left: 5,
        width: RADIUS_CIRCLE,
        height: RADIUS_CIRCLE,
        borderRadius: RADIUS_CIRCLE / 2,
        backgroundColor: COLORS.PINK
    },
    header: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size18,
        textAlign: 'center'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    money: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size28,
        color: COLORS.GREEN
    },
    unit: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        color: COLORS.BLACK,
        marginTop: 3,
        marginLeft: 3
    },
    btnContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        marginHorizontal: 10
    },
    button: {
        width: SCREEN_WIDTH / 3 - 15,
        borderWidth: 1,
        borderColor: COLORS.GRAY_1,
        backgroundColor: COLORS.GRAY_10,
        alignItems: 'center',
        marginHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 5
    },
    dash: {
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 15
    }
});
