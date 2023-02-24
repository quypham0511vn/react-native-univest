import { useContext } from 'react';

import { AppStoreType } from '../providers/app-provider/app-store';
import { AppStoreContext } from '../providers/app-provider/context';

export const useAppStore = () => {
    const payload = useContext<AppStoreType | null>(AppStoreContext);
    if (!payload) {
        throw new Error('useAppStore must be use within AppStoreProvider.');
    }
    return payload;
};
