import React from 'react';
import { StyleSheet, View } from 'react-native';

import { COLORS } from '@/theme';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import Navigator from '../routers/Navigator';

export default class MyWebViewProgress extends React.Component {
    constructor(props) {
        super(props);
        this.state = { contentLoaded: 0 };
    }

    closeView = () => {
        if (this.props.navigation) {
            Navigator.goBack(this.props.navigation);
        }
    };

    setProgress = (val) => {
        this.setState({ contentLoaded: val });
    };

    render() {
        if(this.state.contentLoaded === 1){
            return null;
        }
        return <View style={styles.mainContainer}>
            <View style={[styles.progressView, {
                width: SCREEN_WIDTH * this.state.contentLoaded
            }]}></View>
        </View>;
    }
}
const styles = StyleSheet.create({
    mainContainer: {
        height: 2,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    progressView: {
        backgroundColor: COLORS.RED,
        height: 2,
        left: 0,
        position: 'absolute',
        top: 0
    }
});
