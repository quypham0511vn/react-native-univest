import { createContext } from 'react';

import AppStoreType from './app-store';

export const AppStoreContext = createContext<AppStoreType | null>(null);


