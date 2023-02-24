import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';

export const myTextFieldStyle = () => {
    return useMemo(
        () =>
            StyleSheet.create({
                containerUnderLine: {
                    justifyContent: 'center',
                    paddingVertical: 0,
                    height: Configs.FontSize.size40,
                    borderBottomColor: COLORS.GRAY_7,
                    borderBottomWidth: 1
                },
                container: {
                    justifyContent: 'center',
                    paddingHorizontal: 5,
                    borderRadius: 5,
                    paddingVertical: 0,
                    height: Configs.FontSize.size40,
                    borderColor: COLORS.GRAY_7,
                    borderWidth: 1
                },
                containerMultiline: {
                    justifyContent: 'center',
                    paddingVertical: 10,
                    borderRadius: 10,
                    height: undefined
                },
                labelStyle: {
                    color: COLORS.BLACK,
                    fontSize: Configs.FontSize.size14,
                    fontFamily: Configs.FontFamily.medium                },
                inputStyle: {
                    flex: 1,
                    color:COLORS.BLACK
                },
                inputFont: {
                    ...Styles.typography.regular,
                    color: COLORS.GRAY_6,
                    fontSize: Configs.FontSize.size14
                },
                showHidePassContainer: {
                    position: 'absolute',
                    right: 5,
                    alignSelf: 'center',
                    padding: 5
                },
                errorMessage: {
                    fontSize: Configs.FontSize.size12,
                    fontFamily: Configs.FontFamily.medium,
                    color: COLORS.RED,
                    marginBottom: Configs.IconSize.size10
                },
                flexRow: {
                    flexDirection: 'row',
                    paddingLeft: 10,
                    alignItems:'center'
                },
                leftIconContainer: {
                    width: 20,
                    height: '100%',
                    marginLeft: 10,
                    justifyContent: 'center'
                },
                icRightOther: {
                    width: Configs.IconSize.size16,
                    height: Configs.IconSize.size16
                },
                leftIcon: {
                    fontSize: Configs.IconSize.size14,
                    color: COLORS.GRAY,
                    marginRight: 10
                },
                icPwd: {
                    position: 'relative',
                    right: 0,
                    top: 0,
                    zIndex: 9999,
                    paddingVertical: 10,
                    width: 30,
                    alignItems:'center'
                }
            })
        , []);
};
