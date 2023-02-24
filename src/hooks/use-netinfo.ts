import { useContext } from 'react';

import { NetworkContext } from '../providers/network-provider/context';

export const useNetInfo = () => {
    const payload = useContext(NetworkContext);
    if (!payload) {
        throw new Error('useNetInfo must be use within NetworkContext.');
    }
    return payload;
};
