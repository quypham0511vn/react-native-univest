import { observer, useLocalObservable } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import IcGift from '@/assets/images/ic_gift.svg';
import Languages from '@/commons/Languages';
import { PopupActions } from '@/components/popup/types';
import PopupStatus from '@/components/popupStatus/PopupStatus';
import { ConsultantContext } from './context';

export const ConsultantProvider = observer(({ children }: any) => {
    const popupRef = useRef<PopupActions>(null);
    const storeLocal = useLocalObservable(() => ({}));
    useEffect(()=>{
        // popupRef?.current?.show();
    },[]);

    const onAgree = useCallback(()=>{
        popupRef?.current?.hide();
    },[]);

    const renderPopupNoInternet = useMemo(() => {
        return <PopupStatus
            ref={popupRef}
            description={Languages.consultantInfo.descriptionPopup}
            title={Languages.consultantInfo.titlePopup}
            icon={<IcGift/>}
            isIcon
            hasButton
            onSuccessPress={onAgree}
        />;
    }, [onAgree]);

    return (<>
        <ConsultantContext.Provider value={storeLocal}>
            {children}
        </ConsultantContext.Provider>
        {renderPopupNoInternet}
    </>
    );
});
