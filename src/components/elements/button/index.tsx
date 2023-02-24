import React, { useCallback, useMemo } from 'react';
import { TextStyle, Text } from 'react-native';

import { Configs } from '@/commons/Configs';
import { COLORS } from '@/theme';
import { Touchable } from '../touchable';
import { BUTTON_STYLES } from './constants';
import { useStyleButton } from './styles';
import { ButtonProps } from './types';

export const Button = ({
    label,
    style,
    buttonStyle,
    fontSize = Configs.FontSize.size16,
    isLoading,
    onPress,
    disabled,
    textColor,
    isLowerCase,
    leftIcon,
    tag,
    radius
}: ButtonProps) => {
    const styles = useStyleButton();

    const getContainerStyle = useMemo(() => {
        let containerStyle = {};
        switch (buttonStyle) {
            case BUTTON_STYLES.RED:
                containerStyle = styles.redButton;
                break;
            case BUTTON_STYLES.PINK:
                containerStyle = styles.pinkButton;
                break;
            case BUTTON_STYLES.GRAY:
            default:
                containerStyle = styles.grayButton;
                break;
        }

        return [
            styles.container,
            containerStyle,
            style
        ];
    }, [buttonStyle, styles, style]);

    const getTextColor = useMemo(() => {
        let color;
        switch (buttonStyle) {
            case BUTTON_STYLES.RED:
                color = COLORS.WHITE;
                break;
            case BUTTON_STYLES.PINK:
                color = COLORS.RED;
                break;
            case BUTTON_STYLES.WHITE:
                color = COLORS.BLACK;
                break;
            default:
                color = COLORS.LIGHT_GRAY;
                break;
        }
        return textColor || color;
    }, [buttonStyle, textColor]);

    const getTextStyle = useMemo<TextStyle[]>(() => {
        const color = getTextColor;
        return [styles.text, { color, fontSize }];
    }, [fontSize, getTextColor, styles.text]);

    const _onPress = useCallback(() => {
        onPress?.(tag || label);
    }, [label, onPress, tag]);

    return (
        <Touchable
            disabled={isLoading || disabled}
            style={getContainerStyle}
            radius={radius}
            onPress={_onPress}>
            {leftIcon}
            <Text style={getTextStyle}>
                {isLowerCase ? label : `${label}`.toUpperCase()}
            </Text>
        </Touchable>
    );
};
