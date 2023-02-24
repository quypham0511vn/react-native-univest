import { ReactNode } from 'react';
import { NetInfoState } from '@react-native-community/netinfo';

export type NetInfo = {
  netInfoState?: NetInfoState;
};

export type NetInfoProviderParams = {
  children: ReactNode;
  value: NetInfo;
};
