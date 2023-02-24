import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
    FlatList,
    StyleSheet, Text
} from 'react-native';

import { Configs } from '@/commons/Configs';
import { TopUpTemplate } from '@/commons/constants';
import Languages from '@/commons/Languages';
import { Touchable } from '@/components';
import { Button } from '@/components/elements/button/index';
import { COLORS, Styles } from '@/theme';
import Utils from '@/utils/Utils';
import { MyTextInput } from './elements/textfield';
import { TextFieldActions } from './elements/textfield/types';

const TopUp = ({ label, hasButton, onTopUp }:
    { label: string, hasButton: boolean, onTopUp?: any }) => {

    const amountRef = useRef<TextFieldActions>(null);
    const [price, setPrice] = useState<string>('');

    const renderPriceTemplate = useCallback(({ item }) => {
        let selected = false;
        if (Utils.formatTextToNumber(price) === Utils.formatTextToNumber(item)) {
            selected = true;
        }

        const _onPress = () => {
            setPrice(item);
            amountRef.current?.setValue(item);
        };

        return <Touchable style={selected ? styles.priceSelected : styles.priceUnSelected}
            onPress={_onPress}>
            <Text style={selected ? styles.priceTxtSelected : styles.priceTxtUnSelected}>
                {Utils.formatMoney(item)}
            </Text>
        </Touchable>;
    }, [price]);

    const keyExtractor = useCallback((item) => {
        return `${item}`;
    }, []);

    const onChangeText = useCallback((text) => {
        setPrice(text);
    }, []);

    const isValidAmount = useMemo(() => {
        if (Number.isNaN(price) || Number(price) === 0 || Number(Utils.formatTextToNumber(price)) < 1e5) {
            return false;
        }
        return true;
    }, [price]);

    const onConfirm = useCallback(() => {
        if (Number.isNaN(price) || Number(price) === 0) {
            amountRef.current?.setErrorMsg(Languages.errorMsg.emptyAmount);
        } else if (Number(Utils.formatTextToNumber(price)) < 1e5) {
            amountRef.current?.setErrorMsg(Languages.errorMsg.minAmount);
        } else {
            onTopUp?.(Utils.formatTextToNumber(price));
        }
    }, [onTopUp, price]);

    return (
        <>
            <Text style={styles.section}>
                {label}
            </Text>

            <MyTextInput
                ref={amountRef}
                placeHolder={Languages.topUp.placeHolder}
                containerInput={styles.containerStyle}
                inputStyle={styles.inputStyle}
                keyboardType='NUMERIC'
                formatPrice
                maxLength={15}
                hasUnderline={false}
                onChangeText={onChangeText} />

            <FlatList
                style={styles.flatList}
                data={TopUpTemplate}
                renderItem={renderPriceTemplate}
                numColumns={3}
                scrollEnabled={false}
                {...{ keyExtractor }}
            />
            {hasButton && <Button
                style={styles.btn}
                label={Languages.topUp.confirm}
                onPress={onConfirm}
                buttonStyle={isValidAmount ? 'RED' : 'GRAY'}
            />}
        </>
    );
};

export default TopUp;

const styles = StyleSheet.create({
    section: {
        ...Styles.typography.medium,
        fontSize: Configs.FontSize.size18,
        marginVertical: 5
    },
    containerStyle: {
        height: Configs.FontSize.size50,
        marginVertical: 10
    },
    inputStyle: {
        color: COLORS.RED,
        fontSize: Configs.FontSize.size20
    },
    priceSelected: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: COLORS.RED,
        marginHorizontal: 5,
        marginTop: 10
    },
    priceUnSelected: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: COLORS.GRAY_1,
        marginHorizontal: 5,
        marginTop: 10
    },
    priceTxtSelected: {
        ...Styles.typography.regular,
        color: COLORS.WHITE,
        paddingVertical: 10,
        alignSelf: 'center'
    },
    priceTxtUnSelected: {
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        paddingVertical: 10,
        alignSelf: 'center'
    },
    flatList: {
        flexGrow: 0
    },
    btn: {
        marginVertical: 20
    }
});
