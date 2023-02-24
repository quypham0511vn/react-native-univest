import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet } from 'react-native';

import Languages from '@/commons/Languages';
import { HeaderBar } from '@/components';
import { COLORS } from '@/theme';
import BooksList from './BooksList';
import { Tabs } from '@/libs/react-native-collapsible-tab-view/src';

const ListAccumulatorBook = observer(({ route }: any) => {
    const id = route.params;

    return (
        <>
            <HeaderBar
                title={Languages.accumulatorBook.title} />
            <Tabs.Container
                containerStyle={styles.contentStyle}
            >
                <Tabs.Tab name={Languages.accumulatorBook.having}>
                    <Tabs.ScrollView>
                        <BooksList
                            id={id}
                            option={1}/>
                    </Tabs.ScrollView>
                </Tabs.Tab>
                <Tabs.Tab name={Languages.accumulatorBook.pending}>
                    <Tabs.ScrollView>
                        <BooksList
                            id={id}
                            option={4}
                            isPending />
                    </Tabs.ScrollView>
                </Tabs.Tab>
                <Tabs.Tab name={Languages.accumulatorBook.draw}>
                    <Tabs.ScrollView>
                        <BooksList
                            id={id}
                            option={2}
                            isWithdrawn />
                    </Tabs.ScrollView>
                </Tabs.Tab>
            </Tabs.Container>

        </>
    );
});

export default ListAccumulatorBook;

const styles = StyleSheet.create({
    contentStyle: {
        backgroundColor: COLORS.GRAY_3
    }
});
