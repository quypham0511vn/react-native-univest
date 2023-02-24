import { createContext } from 'react';

import { PopupContextValue } from './types';

const NOOP = () => { };

export const PopupContext = createContext<PopupContextValue>({
    show: NOOP,
    close: NOOP
});
