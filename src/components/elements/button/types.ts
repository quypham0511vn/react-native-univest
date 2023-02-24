import { TextStyle } from 'react-native';

import { BUTTON_STYLES } from './constants';

export type ButtonProps = {
    label: string | number;
    style?: TextStyle;
    buttonStyle?: keyof typeof BUTTON_STYLES;
    fontSize?: number;
    textColor?: string;
    icon?: any;
    isLoading?: boolean;
    leftIcon?: any;
    onPress?: (tag?: string) => any;
    disabled?: boolean;
    hasRightIcon?: boolean,
    isIconFont?: boolean,
    isLowerCase?: boolean,
    tag?: any,
    radius?:any
};
