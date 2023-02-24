import { observer } from 'mobx-react';
import React, { useEffect } from 'react';

import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar } from '@/components';
import AnalyticsUtils from '@/utils/AnalyticsUtils';
import TransactionTabItem from './TransactionTabItem';

const Transactions = observer(() => {
    useEffect(()=>{
        AnalyticsUtils.trackScreen(ScreenNames.transactions);
    },[]);

    return (
        <>
            <HeaderBar
                title={Languages.tabs.transactions} />

            <TransactionTabItem />
        </>
    );
});

export default Transactions;
