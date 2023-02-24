import { ReactNode } from 'react';
import { StyleProp, TouchableOpacityProps, ViewStyle } from 'react-native';

export type TouchableProps = TouchableOpacityProps & {
  children: ReactNode;
  size?: number,
  radius?: number,
  underlayColor?: string;
  style?: StyleProp<ViewStyle>;
};
