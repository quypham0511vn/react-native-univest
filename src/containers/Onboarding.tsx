import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import IcArrowRight from '@/assets/images/ic_arrow_right.svg';
import IcLogoWoText from '@/assets/images/img_logo_header.svg';
import imgOnboarding1 from '@/assets/images/img_onboarding_1.png';
import imgOnboarding2 from '@/assets/images/img_onboarding_2.png';
import imgOnboarding3 from '@/assets/images/img_onboarding_3.png';
import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { HeaderBar, Touchable } from '@/components';
import { ImageSwitcher } from '@/components/ImageSwitcher';
import SessionManager from '@/managers/SessionManager';
import Navigator from '@/routers/Navigator';
import { SCREEN_WIDTH } from '@/utils/DimensionUtils';
import { COLORS, Styles } from '@/theme';

const Onboarding = observer(() => {
    const [step, setStep] = useState<number>(0);
    const [source, setSource] = useState<any>(imgOnboarding1);

    useEffect(() => {
        switch (step) {
            case 0:
                setSource(imgOnboarding1);
                break;
            case 1:
                setSource(imgOnboarding2);
                break;
            case 2:
            default:
                setSource(imgOnboarding3);
                break;
        }
    }, [step]);

    const nextStep = useCallback(() => {
        if (step === 2) {
            Navigator.replaceScreen(ScreenNames.tabs);
            SessionManager.setSkipOnboarding();
        } else {
            setStep(last => (last + 1) % 3);
        }
    }, [step]);

    const renderInActiveDot = useMemo(() => {
        return <View
            style={styles.inActive}
        />;
    }, []);

    const renderActiveDot = useMemo(() => {
        return <View
            style={styles.active}
        />;
    }, []);

    const renderIndicator = useMemo(() => {
        return <View style={styles.paginatorContainer}>
            {step === 0 ? renderActiveDot : renderInActiveDot}
            {step === 1 ? renderActiveDot : renderInActiveDot}
            {step === 2 ? renderActiveDot : renderInActiveDot}
        </View>;
    }, [renderActiveDot, renderInActiveDot, step]);

    const renderMainLogo = useMemo(() => {
        return <View style={styles.top}>
            <IcLogoWoText style={styles.bigImg} />

            <ImageSwitcher source={source}
                style={styles.image} />
        </View>;
    }, [source]);

    const renderContent = useMemo(() => {
        return <View style={styles.center}>
            <View style={styles.content}>
                <Text style={styles.title}>
                    {Languages.onBoarding[step].title}
                </Text>
                <Text style={styles.des}>
                    {Languages.onBoarding[step].des}
                </Text>
            </View>
        </View>;
    }, [step]);

    const renderFooter = useMemo(() => {
        return <View style={styles.bottom}>
            {renderIndicator}

            <Touchable style={styles.roundedImg}
                radius={20}
                onPress={nextStep}>

                <IcArrowRight style={styles.smallImg} />
            </Touchable>
        </View>;
    }, [nextStep, renderIndicator]);

    return (
        <View style={styles.container}>
            <HeaderBar
                noStatusBar
                noHeader
            />

            {renderMainLogo}
            {renderContent}
            {renderFooter}
        </View>
    );
});

export default Onboarding;
const INDICATOR_HEIGHT = 100;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.WHITE
    },
    top: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 30
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bottom: {
        flex: 0.7,
        height: INDICATOR_HEIGHT,
        paddingHorizontal: 10,
        alignItems: 'center',
        flexDirection: 'row',
        alignContent: 'space-between'
    },
    image: {
        width: SCREEN_WIDTH / 1.2,
        height: SCREEN_WIDTH / 1.2 / 717 * 562,
        alignItems: 'center'
    },
    smallImg: {
        width: 20,
        height: 20,
        alignItems: 'center'
    },
    bigImg: {
        alignItems: 'center',
        marginVertical: 10
    },
    roundedImg: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.RED
    },
    content: {
        alignItems: 'center',
        marginHorizontal: 20
    },
    title: {
        ...Styles.typography.bold,
        fontSize: Configs.FontSize.size24,
        marginBottom: 15,
        color: COLORS.RED
    },
    des: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size16,
        marginBottom: 15,
        textAlign: 'center'
    },
    paginatorContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    active: {
        width: 32,
        height: 8,
        backgroundColor: COLORS.RED,
        marginHorizontal: 2,
        borderRadius: 4
    },
    inActive: {
        width: 12,
        height: 8,
        backgroundColor: COLORS.GRAY,
        marginHorizontal: 2,
        borderRadius: 4
    }
});
