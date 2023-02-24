import React, { useCallback, useMemo } from 'react';
import {
    StyleSheet, Text, View
} from 'react-native';
import { observer } from 'mobx-react-lite';

import { COLORS, Styles } from '@/theme';
import Languages from '@/commons/Languages';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { Configs } from '@/commons/Configs';

const NoteValidate = observer(({uppercase, lower, special, min8}: {uppercase: boolean, lower: boolean, special: boolean, min8: boolean}) => {

    const renderTextNote = useCallback(
        (text: string, active: boolean) => {
            return (
                <Text style={[styles.noteText, active && styles.colorText]}>
                    {Languages.product.dot}
                    {text}
                </Text>
            );
        },
        []
    );


    const renderNoteValidate = useMemo(
        () => {
            return (
                <>
                    <View style={styles.note}>
                        {renderTextNote(Languages.auth.oneUppercase, uppercase)}
                        {renderTextNote(Languages.auth.oneCharacter, special)}
                    </View>
                    <View style={styles.note}>
                        {renderTextNote(Languages.auth.min8, min8)}
                        {renderTextNote(Languages.auth.oneCapLower, lower)}
                    </View>
                </>
            );
        },
        [lower, min8, renderTextNote, special, uppercase]
    );

    return renderNoteValidate;
});

export default NoteValidate;

const styles = StyleSheet.create({
    note: {
        flexDirection: 'row',
        paddingBottom: 10
    },
    noteText:{
        ...Styles.typography.regular,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12,
        width: SCREEN_WIDTH/2 - 16
    },
    colorText: {
        color: COLORS.GREEN
    }
});
