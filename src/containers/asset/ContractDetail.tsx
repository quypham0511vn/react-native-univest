import { useIsFocused } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import Languages from '@/commons/Languages';
import AssetsHeader from '@/components/header/AssetsHeader';
import KeyValue from '@/components/KeyValue';
import { useAppStore } from '@/hooks';
import { AssetsModelData } from '@/models/assets';
import Utils from '@/utils/Utils';
import Card from './Card';
import MyAssetsDetail from './MyAssetsDetail';
import MyLoading from '@/components/MyLoading';

const ContractDetail = observer(({ route }: any) => {
    const { apiServices } = useAppStore();

    const contractDetail = route?.params.item as AssetsModelData;
    const isUnlimited = route?.params.isUnlimited;

    const packageId = isUnlimited ? contractDetail.wallet_id : contractDetail.id;
    const contractId = isUnlimited ? contractDetail.contract_id : contractDetail.id;
    const isFocused = useIsFocused();

    const [accumulatedAsset, setAccumulatedAsset] = useState<AssetsModelData>();
    const [isLoading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        const res = await apiServices.assets.getAccumulatedAsset(packageId);
        if (res.success) {
            const data = res.data as AssetsModelData;
            data.id = packageId;
            setAccumulatedAsset(data);
        }
        setLoading(false);
    }, [apiServices.assets, packageId]);

    useEffect(() => {
        if (isFocused) {
            fetchData();
        }
    }, [isFocused]);

    const renderCardSection = useCallback((label: string, value: string, color: string, unit?: string) => {
        return <KeyValue
            style={styles.cardSection}
            {...{ label, value, color, unit }} />;
    }, []);

    const renderCardContent = useMemo(() => {
        return <>
            {/* {isUnlimited && renderCardSection(Languages.assets.receivedTemp, contractDetail.provisional_interest, contractDetail.color_provisional_interest, Languages.common.currency)} */}
        </>;
    }, [contractDetail.color_provisional_interest, contractDetail.provisional_interest, isUnlimited, renderCardSection]);

    const onFilterChanged = useCallback(() => {
        fetchData();
    }, [fetchData]);

    const renderTabHeader = useMemo(() => {
        return <Card
            title={isUnlimited ? contractDetail.name : `${Languages.assets.totalAccumulated} ${contractDetail.name}`}
            data={accumulatedAsset}
            renderContent={renderCardContent}
            idContract={contractId}
            packageId={packageId}
            isUnlimited={isUnlimited}
            hasTopUp
            hasConvert={isUnlimited}
            hasWithdraw={isUnlimited}
            onFilterChanged={onFilterChanged} />;
    }, [isUnlimited, contractDetail, accumulatedAsset, renderCardContent, contractId, packageId, onFilterChanged]);

    const renderHeader = useMemo(() => {
        return <AssetsHeader
            title={isUnlimited ? contractDetail.name : Languages.assets.accumulation}
            price={Utils.formatMoney(contractDetail.total_money_all)}
            id={packageId} />;
    }, [contractDetail.name, contractDetail.total_money_all, isUnlimited, packageId]);

    return (
        <>
            {renderHeader}

            <ScrollView>
                {renderTabHeader}
                <MyAssetsDetail
                    contractDetail={contractDetail}
                    contractId={packageId} />
            </ScrollView>
            {isLoading && <MyLoading isOverview/>}
        </>
    );
});

export default ContractDetail;

const styles = StyleSheet.create({
    cardSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 3
    }
});
