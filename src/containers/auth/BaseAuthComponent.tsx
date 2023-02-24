import React, { useMemo
} from 'react';
import { StyleSheet, View } from 'react-native';


const BaseAuthComponent = ({ topComponent }: any) => {
   
    const renderTop = useMemo(() => {
        return topComponent;
    }, [topComponent]);

    return (
        <View style={styles.container}>
            {renderTop}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16    
    }
});

export default BaseAuthComponent;
