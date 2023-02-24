import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView } from 'react-native';

import Languages from '@/commons/Languages';
import AssetsHeader from '@/components/header/AssetsHeader';
import { useAppStore } from '@/hooks';
import { AssetsModelData, TypeAssetsModel } from '@/models/assets';
import { ProductModel } from '@/models/product';
import Utils from '@/utils/Utils';
import Card from './Card';
import MyAssets from './MyAssets';
import MyLoading from '@/components/MyLoading';

const AccumulatedAssets = observer(({ route }: any) => {

    const { apiServices } = useAppStore();
    const [data, setData] = useState<TypeAssetsModel>();
    const [products, setProducts] = useState<ProductModel[]>([]);
    const [isLoading, setLoading] = useState<boolean>(true);

    const { item } = route.params as { item: AssetsModelData };

    const fetchData = useCallback(async () => {
        const res = await apiServices.assets.getDetailsAssets(item.id);
        if (res.success) {
            setData(res.data as TypeAssetsModel);
        } else {
            setData({ contracts: [] });
        }

        const resProduct = await apiServices.common.getProducesV1();
        if (resProduct.success) {
            setProducts(resProduct.data as ProductModel[]);
        }
        setLoading(false);
    }, [apiServices.assets, apiServices.common, item.id]);

    useEffect(() => {
        fetchData();
    }, []);

    const onFilterChanged = useCallback(() => {
        fetchData();
    }, [fetchData]);

    const renderTabHeader = useMemo(() => {
        return <Card
            title={`${Languages.assets.totalAccumulated} ${item.name}`}
            data={data?.total}
            hasTopUp
            onFilterChanged={onFilterChanged}
        />;
    }, [data?.total, item.name, onFilterChanged]);

    const renderHeader = useMemo(() => {
        return <AssetsHeader
            title={item.name}
            price={Utils.formatMoney(data?.total?.total_money_all)}
            groupId={item.id} />;
    }, [data?.total?.total_money_all, item.id, item.name]);

    return (
        <>
            {renderHeader}

            <ScrollView>
                {renderTabHeader}
                <MyAssets
                    contracts={data?.contracts}
                    products={products} />
            </ScrollView>
            {isLoading && <MyLoading isOverview/>}
        </>
    );
});

export default AccumulatedAssets;
