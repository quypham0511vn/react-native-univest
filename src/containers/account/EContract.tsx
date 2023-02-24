import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import WebView from 'react-native-webview';
import RNFS from 'react-native-fs';

import MyWebViewProgress from '@/components/MyWebViewProgress';
import { HeaderBar } from '@/components';
import { isIOS, PADDING_BOTTOM } from '@/commons/Configs';
import Navigator from '@/routers/Navigator';
import Languages from '@/commons/Languages';
import { LINK } from '@/api/constants';
import { useAppStore } from '@/hooks';
import MyLoading from '@/components/MyLoading';
import DateUtils from '@/utils/DateUtils';
import { MoneyMethodModal } from '@/models/user-model';
import { PaymentMethods } from '@/commons/constants';

const EContract = ({ route }: any) => {
    const { userManager, apiServices } = useAppStore();

    const webProgressRef = useRef(null);
    const webViewRef = useRef<WebView>(null);

    const [canGoBack, setCanGoBack] = useState(false);
    const [data, setData] = useState<string>();
    const [isLoading, setLoading] = useState<boolean>(true);

    const bankInfo = useRef<MoneyMethodModal>();

    const onGoBack = useCallback(() => {
        if (canGoBack) {
            webViewRef.current?.goBack();
        }
        else {
            Navigator.goBack();
        }
    }, [canGoBack]);

    const readFile = useCallback(async () => {
        if(isIOS){
            RNFS.readDir(RNFS.MainBundlePath)
                .then(async (files) => {
                    const file = files.find(item => item.name.includes('e-contract.html'));
                    if (file) {
                        setData(insertData(await RNFS.readFile(file?.path, 'utf8')));
                    }

                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                });
        }else{
            RNFS.readDirAssets('')
                .then(async (files) => {
                    const file = files.find(item => item.name.includes('e-contract.html'));

                    if (file) {
                        setData(insertData(await RNFS.readFileAssets(file?.path, 'utf8')));
                    }

                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                })
                .catch((err) => {
                    console.log(err.message, err.code);
                });
        }
    }, []);

    const insertData = useCallback((content) => {
        if (userManager.userInfo) {
            const address = [userManager?.userInfo?.ward_name, userManager.userInfo.district_name, userManager.userInfo.city_name].filter(item => !!item);
            const fullAddress = address.join(', ');
            const BLANK = '__';

            content = content.replace(/{link_ios}/ig, LINK.STORE_IOS);
            content = content.replace(/{link_android}/ig, LINK.STORE_ANDROID);

            content = content.replace(/{user_id}/ig, `${userManager.userInfo.identifier || userManager.userInfo.id}`);
            content = content.replace(/{created_at}/ig, DateUtils.getLongFromDate(userManager.userInfo.created_at));

            content = content.replace(/{full_name}/ig, `${userManager.userInfo.full_name?.toUpperCase() || BLANK}`);
            content = content.replace(/{phone_number}/ig, `${userManager.userInfo.phone || BLANK}`);

            content = content.replace(/{email}/ig, `${userManager.userInfo.email || BLANK}`);
            content = content.replace(/{gender}/ig, `${userManager.userInfo.gender_name || BLANK}`);
            content = content.replace(/{address}/ig, userManager.userInfo.address || fullAddress || BLANK);

            content = content.replace(/{identity}/ig, `${ userManager.userInfo.identity || BLANK}`);
            content = content.replace(/{date_identity}/ig, `${userManager.userInfo.date_identity || BLANK}`);
            content = content.replace(/{address_identity}/ig, `${userManager.userInfo.address_identity|| BLANK}`);
            content = content.replace(/{tax_code}/ig, `${userManager.userInfo.tax_code || BLANK}`);

            content = content.replace(/{name_account_bank}/ig, `${bankInfo.current?.name || BLANK}`);
            content = content.replace(/{account_bank}/ig, `${bankInfo.current?.account || BLANK}`);
            content = content.replace(/{name_bank}/ig, `${bankInfo.current?.bank_name || BLANK}`);
        }

        return content;
    }, [bankInfo, userManager.userInfo]);

    const fetchData = useCallback(async () => {
        const res = await apiServices.auth.moneyMethod();

        if (res.success) {
            const banks = res?.data as MoneyMethodModal[];
            bankInfo.current = (banks.find(item => item.type === PaymentMethods[2].value.toString()));
            readFile();
        } else {
            setLoading(false);
        }
    }, [apiServices.auth, readFile]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.mainContainer}>

            <HeaderBar
                hasBack
                title={Languages.account.electricContract}
                onGoBack={onGoBack}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <MyWebViewProgress
                    ref={webProgressRef}
                />

                {data && <WebView
                    ref={webViewRef}
                    source={{ html: data }}
                    javaScriptEnabled={true}
                    onNavigationStateChange={(navState) => {
                        setCanGoBack(navState.canGoBack);
                    }}
                    incognito={true}
                    cacheEnabled={true}
                />}
            </ScrollView>

            {isLoading && <MyLoading isOverview />}
        </View>
    );
};

export default EContract;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        paddingBottom: PADDING_BOTTOM
    },
    scrollContent: {
        flex: 1
    }
});
