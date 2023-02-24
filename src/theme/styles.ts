import { StyleSheet } from 'react-native';

import { Configs } from '../commons/Configs';
import { COLORS } from './colors';

export const Styles = {
    flexColumn: {
        flex: 1
    },

    typography: StyleSheet.create({
        // white
        regular: {
            color: COLORS.BLACK,
            fontSize: Configs.FontSize.size14,
            fontFamily: Configs.FontFamily.regular
        },
        medium: {
            color: COLORS.BLACK,
            fontSize: Configs.FontSize.size14,
            fontFamily: Configs.FontFamily.medium
        },
        bold: {
            color: COLORS.BLACK,
            fontSize: Configs.FontSize.size14,
            fontFamily: Configs.FontFamily.bold
        }
    }),

    /// //////
    shadow: {
        backgroundColor: COLORS.WHITE,
        shadowColor: COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 1
    },
    textTransform: {
        textTransform: 'uppercase'
    }
};

export const HtmlStyles = {
    a: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        textAlign: 'center'
    },
    b: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        textAlign: 'center'
    },
    w: {
        ...Styles.typography.regular,
        color: COLORS.WHITE,
        fontSize: Configs.FontSize.size13,
        textAlign: 'center'
    },
    g: {
        ...Styles.typography.medium,
        color: COLORS.GREEN,
        fontSize: Configs.FontSize.size13,
        marginTop: 5
    },
    r: {
        ...Styles.typography.medium,
        color: COLORS.RED
    },
    p: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        textAlign: 'justify'
    },
    c: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        textAlign: 'center'
    },
    pp: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        textAlign: 'justify',
        marginTop: 15,
        marginBottom: 10,
        marginHorizontal: 10
    },
    pw: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        marginTop: 15,
        marginBottom: 10
    },
    strong: {
        ...Styles.typography.medium,
        color: COLORS.RED,
        fontSize: Configs.FontSize.size16
    },
    u: {
        textDecorationLine: 'underline'
    },
    pr: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_6,
        marginTop: 3
    },
    as: {
        ...Styles.typography.regular,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size12
    }
};

export const HtmlStylesSeen = {
    w: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_2,
        fontSize: Configs.FontSize.size14
    },
    b: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_2,
        fontSize: Configs.FontSize.size14
    },
    p: {
        marginVertical: 5
    },
    span: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size14
    },
    a: {
        ...Styles.typography.medium,
        color: COLORS.BLACK,
        fontSize: Configs.FontSize.size14
    }
};

export const RenderHtmlStyle = {
    p: {
        paddingTop: 0,
        paddingBottom: 0,
    },
};
