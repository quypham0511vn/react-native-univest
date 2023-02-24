import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Dash from 'react-native-dash';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { Button, HeaderBar, Touchable } from '@/components';
import { MyTextInput } from '@/components/elements/textfield';
import { MyImageView } from '@/components/image';
import { COLORS, Styles } from '@/theme';
import { useAppStore } from '@/hooks';
import { ReferralInfoModel } from '@/models/referral-model';
import MyLoading from '@/components/MyLoading';
import ToastUtils from '@/utils/ToastUtils';
import { TextFieldActions } from '@/components/elements/textfield/types';

const ConsultantInfo = observer(() => {
    const { apiServices, userManager } = useAppStore();

    const [isLoading, setLoading] = useState<boolean>(true);
    const [referralInfo, setReferralInfo] = useState<ReferralInfoModel>();
    const referralRef = useRef<TextFieldActions>();

    const fetchData = useCallback(async () => {
        setLoading(true);
        const res = await apiServices.auth.getReferenceInfo();
        setLoading(false);
        if (res.success) {
            setReferralInfo(res.data as ReferralInfoModel);
        }
    }, [apiServices.auth]);

    const requestSupport = useCallback(async () => {
        const res = await apiServices.auth.requestSupport();
        if (res.success && res.message) {
            ToastUtils.showSuccessToast(res.message);
        }
    }, [apiServices.auth]);

    const updateReference = useCallback(async () => {
        const referralCode = referralRef.current?.getValue().trim();

        if (referralCode) {
            const res = await apiServices.auth.updateReference(referralCode);
            if (res.success && res.message) {
                ToastUtils.showSuccessToast(res.message);
                fetchData();
            }
        } else {
            referralRef.current?.setErrorMsg(Languages.errorMsg.errReferral);
        }

    }, [apiServices.auth, fetchData]);

    useEffect(() => {
        fetchData();
    }, []);

    const renderItem = useCallback((label: string, value: string) => {
        return (
            <Touchable>
                <Dash
                    dashThickness={1}
                    dashLength={10}
                    dashGap={5}
                    dashColor={COLORS.GRAY_1} />
                <View style={styles.wrapItem}>
                    <View>
                        <Text style={styles.txtLabelName}>{label}</Text>
                        <Text style={styles.txtName}>{value}</Text>
                    </View>
                </View>
            </Touchable>
        );
    }, []);

    const renderBody = useMemo(() => {
        if (referralInfo?.phone) {
            return (
                <>
                    <View
                        style={styles.wrapAvatar}
                    >
                        <View style={styles.wrapAvatarImage}>
                            <MyImageView
                                style={styles.image}
                                imageUrl={referralInfo?.avatar}
                                resizeMode={'stretch'}
                            />
                        </View>

                    </View>
                    <View style={styles.wrapInfo}>
                        <Text style={styles.txtCon}>{Languages.consultantInfo.consultant}</Text>
                        {renderItem(Languages.consultantInfo.fullName, referralInfo?.full_name)}
                        {renderItem(Languages.consultantInfo.phoneNumber, referralInfo?.phone)}
                        {renderItem(Languages.consultantInfo.email, referralInfo?.email)}
                    </View>
                    <Button
                        style={styles.button}
                        label={Languages.consultantInfo.require}
                        textColor={COLORS.WHITE}
                        onPress={requestSupport}
                    />
                </>
            );
        }
        return (
            <View style={styles.wrapBody}>
                <Text style={styles.txtDes}>{Languages.consultantInfo.description}</Text>
                <Text style={styles.txtId}>{Languages.consultantInfo.id}</Text>
                <MyTextInput
                    ref={referralRef}
                    placeHolder={Languages.consultantInfo.enterId}
                    containerInput={styles.input}
                />
                <Button
                    label={Languages.consultantInfo.addConsultant}
                    style={styles.buttonAdd}
                    textColor={COLORS.WHITE}
                    onPress={updateReference}
                />
            </View>
        );

    }, [referralInfo, renderItem, requestSupport, updateReference]);

    return (
        <View style={styles.container}>
            <HeaderBar title={Languages.consultantInfo.title} />
            {renderBody}
            {isLoading && <MyLoading isOverview />}
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    image: {
        height: 150,
        width: 120
    },
    wrapAvatar: {
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 20
    },
    wrapAvatarImage: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        height: 120,
        width: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: COLORS.RED,
        backgroundColor: COLORS.WHITE,
        overflow: 'hidden'
    },
    wrapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 5
    },
    txtItem: {
        ...Styles.typography.medium
    },
    wrapChart: {
        backgroundColor: COLORS.WHITE,
        marginTop: 16,
        borderRadius: 16,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_12
    },
    txtTitle: {
        ...Styles.typography.medium,
        marginLeft: 16
    },
    txtLabelName: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12,
        marginBottom: 4
    },
    txtLabel: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12,
        marginBottom: 4,
        textAlign: 'right'
    },
    txtName: {
        ...Styles.typography.medium,
        color: COLORS.BLACK
    },
    wrapInfo: {
        backgroundColor: COLORS.WHITE,
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: COLORS.GRAY_12,
        paddingBottom: 5,
        marginTop: 10,
        marginHorizontal: 16
    },
    txtCon: {
        ...Styles.typography.medium,
        textAlign: 'center',
        color: COLORS.RED,
        marginBottom: 10,
        fontSize: Configs.FontSize.size16
    },
    button: {
        backgroundColor: COLORS.RED,
        marginTop: 20,
        marginHorizontal: 16
    },
    txtDes: {
        ...Styles.typography.regular,
        marginTop: 20,
        color: COLORS.BACKDROP
    },
    wrapBody: {
        marginHorizontal: 16
    },
    txtId: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size16,
        color: COLORS.RED,
        marginTop: 10
    },
    input: {
        marginTop: -5,
        borderBottomColor: COLORS.WHITE,
        borderRadius: 5
    },
    buttonAdd: {
        backgroundColor: COLORS.RED,
        marginTop: 20
    }
});

export default ConsultantInfo;
