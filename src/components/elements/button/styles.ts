import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { Configs } from '@/commons/Configs';
import { COLORS, Styles } from '@/theme';

export const useStyleButton = () => {

    return useMemo(
        () =>
            StyleSheet.create({
                // default
                container: {
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    justifyContent: 'center',
                    height: Configs.FontSize.size45,
                    borderRadius: 5,
                    flexDirection: 'row'
                },
                icon: {
                    width: Configs.IconSize.size14,
                    height: Configs.IconSize.size14,
                    marginRight: 5
                },
                rightIcon: {
                    paddingLeft: 10
                },
                lefIconFont: {
                    paddingRight: 20,
                    fontSize: Configs.IconSize.size30
                },
                text: {
                    ...Styles.typography.medium,
                    textAlign: 'center',
                    flex: 1,
                    color: COLORS.WHITE
                },
                // background & border
                redButton: {
                    backgroundColor: COLORS.RED
                },
                pinkButton: {
                    backgroundColor: COLORS.PINK
                },
                blueButton: {
                    backgroundColor: COLORS.BLUE
                },
                grayButton: {
                    backgroundColor: COLORS.GRAY_1
                }
            }),
        []
    );
};
