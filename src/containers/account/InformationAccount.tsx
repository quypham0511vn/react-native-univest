import { useIsFocused } from '@react-navigation/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Dash from 'react-native-dash';
import FastImage from 'react-native-fast-image';

import IdentifyIcon from '@/assets/images/ic_default_identify.svg';
import EditIcon from '@/assets/images/ic_edit.svg';
import { Configs, isIOS } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar, Touchable } from '@/components';
import { useAppStore } from '@/hooks';
import { UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import DateUtils from '@/utils/DateUtils';

const SettingAccount = () => {
    const [values, setValue] = useState<UserInfoModel>();
    const { apiServices, userManager } = useAppStore();
    const isFocused = useIsFocused();

    useEffect(() => {
        if(isFocused){
            fetchInfoUser();
        }
    }, [isFocused]);

    const fetchInfoUser = useCallback(async () => {
        const res = await apiServices.auth.getInformationAuth();
        if (res?.data) {
            const data = res?.data as UserInfoModel;
            userManager?.updateUserInfo({
                ...userManager?.userInfo,
                accuracy: data?.accuracy,
                affiliate: data.affiliate,
                is_ctv: data?.is_ctv
            });
            setValue(data);
        }
    }, [apiServices.auth]);

    const renderItem = useCallback((label: string, value: any) => {
        return (
            <View>
                <View style={styles.item}>
                    <View style={styles.wrapLabel}>
                        <Text style={styles.label}>{label}</Text>
                    </View>
                    <View style={styles.wrapValue}>
                        <Text style={styles.value}>{value}</Text>
                    </View>
                </View>
                <Dash
                    dashThickness={1}
                    dashLength={5}
                    dashGap={2}
                    dashColor={COLORS.GRAY_7}
                />
            </View>
        );
    }, []);

    const navigateToIdentify = useCallback(() => {
        Navigator.navigateScreen(ScreenNames.identifyConfirm);
    }, []);

    const renderImg = useCallback(
        (label: string, image?: string) => {
            if (userManager?.userInfo?.accuracy === 0 || userManager.userInfo?.accuracy === 3) {
                return (
                    <Touchable onPress={navigateToIdentify} style={styles.item2}>
                        <View>
                            <Text style={styles.value}>{label}</Text>
                            <View style={styles.wrapIcon}><IdentifyIcon /></View>
                        </View>
                    </Touchable>
                );
            }
            return (
                <Touchable disabled={userManager?.userInfo?.accuracy === 1 || userManager?.userInfo?.accuracy === 2} onPress={navigateToIdentify} style={styles.item2}>
                    <View>
                        <Text style={styles.value}>{label}</Text>
                        {!!image && <FastImage
                            style={styles.image}
                            source={{ uri: image }}
                            resizeMode={isIOS ? 'contain' : 'stretch'}
                        />}
                    </View>
                </Touchable>
            );
        },
        [navigateToIdentify, userManager?.userInfo?.accuracy]
    );
    const returnAddress = useCallback(() => {
        const address = [values?.ward_name, values?.district_name, values?.city_name].filter(item => !!item);
        return address.join(', ');
    }, [values?.city_name, values?.district_name, values?.ward_name]);

    const goToEditProfile = useCallback(() => {
        Navigator.pushScreen(ScreenNames.editProfile);
    }, []);

    const renderTitle = useCallback(() => {
        switch (userManager?.userInfo?.accuracy) {
            case 0:
                return Languages.account.confirmEKYC;
            case 1:
                return Languages.account.doneEKYC;
            case 2:
                return Languages.account.waitKYC;
            case 3:
                return Languages.account.errKYC;
            default:
                return Languages.account.confirmEKYC;
        }
    }, [userManager?.userInfo?.accuracy]);

    const getBorderColor = useMemo(() => {
        if (userManager?.userInfo?.accuracy !== 1) {
            return {
                borderColor: COLORS.RED,
                borderWidth: 1.5

            } as ViewStyle;
        }
        return null;
    }, [userManager?.userInfo?.accuracy]);

    return (
        <View style={styles.mainContainer}>
            <HeaderBar hasBack title={Languages.information.title} />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                <View style={styles.wrapInfo}>
                    <View style={styles.header}>
                        <Text style={styles.txtName}>
                            {userManager.userInfo?.full_name}
                        </Text>
                        <Dash
                            dashThickness={1}
                            dashLength={5}
                            dashGap={2}
                            dashColor={COLORS.GRAY_7}
                        />
                        <Touchable onPress={goToEditProfile} style={styles.editIcon}>
                            <EditIcon />
                        </Touchable>
                        {renderItem(Languages.information.sex, values?.gender_name || '')}
                        {renderItem(Languages.information.birthday, DateUtils.getDateFromClient(values?.birthday) || '')}
                        {renderItem(Languages.information.phone, values?.phone)}
                        {renderItem(Languages.information.address, returnAddress())}
                        {renderItem(Languages.information.job, values?.job_name)}
                        {renderItem(Languages.information.taxId, values?.tax_code)}
                        {renderItem(Languages.information.email, values?.email)}
                    </View>
                </View>
                <View style={[styles.wrapBottom, getBorderColor]}>
                    <View style={styles.header}>
                        <Text style={styles.txtName}>
                            {renderTitle()}
                        </Text>
                        <Dash
                            dashThickness={1}
                            dashLength={5}
                            dashGap={2}
                            dashColor={COLORS.GRAY_7}
                        />
                        {renderImg(Languages.information.up, values?.front_facing_card)}
                        <Dash
                            dashThickness={1}
                            dashLength={5}
                            dashGap={2}
                            dashColor={COLORS.GRAY_7}
                        />
                        {renderImg(
                            Languages.information.under,
                            values?.card_back
                        )}
                        <Dash
                            dashThickness={1}
                            dashLength={5}
                            dashGap={2}
                            dashColor={COLORS.GRAY_7}
                        />
                        {renderImg(
                            Languages.information.avatar,
                            values?.avatar
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default SettingAccount;

const styles = StyleSheet.create({
    scroll: {
        paddingBottom: 30
    },
    image: {
        ...Styles.shadow,
        backgroundColor: COLORS.WHITE,
        marginTop: 7,
        borderRadius: 5,
        width: 160,
        height: 175,
        alignSelf: 'center'
    },
    mainContainer: {
        flex: 1
    },
    wrapInfo: {
        ...Styles.shadow,
        paddingTop: 10,
        paddingBottom: 8,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 16,
        paddingHorizontal: 16
    },
    wrapBottom: {
        ...Styles.shadow,
        paddingTop: 10,
        paddingBottom: 8,
        backgroundColor: COLORS.WHITE,
        borderRadius: 16,
        marginHorizontal: 16,
        marginTop: 16,
        paddingHorizontal: 16,
        marginBottom: 50
    },

    header: {
        width: '100%'
    },
    txtName: {
        textAlign: 'center',
        marginTop: 5,
        fontSize: Configs.FontSize.size16,
        fontFamily: Configs.FontFamily.medium,
        color: COLORS.RED_4,
        marginBottom: 10,
        marginHorizontal: 20,
        paddingHorizontal: 10
    },
    editIcon: {
        position: 'absolute',
        right: 0
    },
    item: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: 8,
        alignItems: 'center'
    },
    wrapLabel: {
        flex: 1.5
    },
    wrapValue: {
        flex: 3.5,
        alignItems: 'flex-end'
    },
    label: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6
    },
    value: {
        ...Styles.typography.medium,
        color: COLORS.BLACK
    },
    item2: {
        marginTop: 10,
        paddingBottom: 10,
        borderColor: COLORS.RED
    },
    wrapIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.GRAY_3,
        borderRadius: 10,
        marginTop: 10,
        borderColor: COLORS.GRAY_7,
        borderWidth: 1
    }
});
