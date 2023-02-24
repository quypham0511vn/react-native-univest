import React, { useCallback, useMemo, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle
} from 'react-native';
import ImagePicker, { ImageOrVideo } from 'react-native-image-crop-picker';

import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { useAppStore } from '@/hooks';
import { COLORS, Styles } from '@/theme';
import IdentifyIcon from '@/assets/images/ic_default_identify.svg';
import { Configs, isIOS } from '@/commons/Configs';
import ToastUtils from '@/utils/ToastUtils';
import { UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import MyLoading from '@/components/MyLoading';

const IdentifyConfirm = () => {
    const { apiServices, userManager } = useAppStore();
    const [frontIdentity, seFrontIdentity] = useState<ImageOrVideo>();
    const [behindIdentity, setBehindIdentity] = useState<ImageOrVideo>();
    const [avatar, setAvatar] = useState<ImageOrVideo>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const uploadImage = useCallback(
        async (file, type) => {
            const res = await apiServices?.image.uploadImage(
                file,
                Languages.errorMsg.uploading
            );
            if (res.success) {
                const data = res?.data;
                return {
                    ...data,
                    type
                };
            }
            ToastUtils.showErrorToast(Languages.errorMsg.uploadingError);
            return '';
        },
        [apiServices?.image]
    );

    const uploadIdentify = useCallback(
        async (imgAvatar, imgFront, imgBehind) => {
            if (imgAvatar && imgBehind && imgBehind) {
                setIsLoading(true);
                const res = await apiServices?.image?.uploadIdentify(
                    imgAvatar,
                    imgFront,
                    imgBehind
                );
                setIsLoading(false);
                if (res.success) {
                    const data = res?.data as UserInfoModel;
                    userManager?.updateUserInfo({
                        ...userManager?.userInfo,
                        front_facing_card: data?.front_facing_card,
                        card_back: data?.card_back,
                        avatar: data?.avatar,
                        accuracy: data?.accuracy
                    });
                    setTimeout(() => Navigator?.goBack(), 1000);
                    ToastUtils.showSuccessToast(Languages.identifyConfirm.uploadSuccess);
                }
            }
            else {
                ToastUtils.showErrorToast(Languages.errorMsg.uploadingError);
            }
        },
        [apiServices?.image, userManager]
    );

    const getDataUpload = useCallback(
        async (response: any) => {
            let imgFront;
            let imgBehind;
            let imgAvatar;
            if (response?.length === 3) {
                response?.map((item: any) => {
                    if (item?.type === 1) imgFront = item?.path;
                    if (item?.type === 2) imgBehind = item?.path;
                    if (item?.type === 3) imgAvatar = item?.path;
                    return null;
                });
                uploadIdentify(imgAvatar, imgFront, imgBehind);
            }
        },
        [uploadIdentify]
    );

    const uploadFrontIdentify = useCallback(() => {
        Promise.all([
            uploadImage(frontIdentity, 1),
            uploadImage(behindIdentity, 2),
            uploadImage(avatar, 3)
        ]).then((response) => getDataUpload(response));
    }, [avatar, behindIdentity, frontIdentity, getDataUpload, uploadImage]);

    const onTakeFront = useCallback(() => {
        ImagePicker.openCamera({
            cropping: true,
            width: 600,
            height: 800
        }).then(async (image) => {
            seFrontIdentity(image);
        });
    }, []);

    const onTakeBehind = useCallback(() => {
        ImagePicker.openCamera({
            cropping: true,
            width: 600,
            height: 800
        }).then((image) => {
            setBehindIdentity(image);
        });
    }, []);

    const onTakeAvatar = useCallback(() => {
        ImagePicker.openCamera({
            cropping: true,
            width: 600,
            height: 800
        }).then((image) => {
            setAvatar(image);
        });
    }, []);

    const renderImg = useCallback(
        (label: string, onPress?: any, image?: ImageOrVideo) => {
            const renderImage = (value: any) => {
                if (value) {
                    return <Image style={styles.image} source={{ uri: image?.path }} resizeMode={isIOS ? 'contain' : 'stretch'} />;
                }
                return <IdentifyIcon />;
            };

            return (
                <View style={styles.item2}>
                    <Text style={styles.value}>{label}</Text>
                    <Touchable onPress={onPress} style={styles.wrapImage}>
                        {renderImage(image?.path)}
                    </Touchable>
                </View>
            );
        }, []);

    const renderButtonUpdate = useMemo(() => {
        
        const disabled = (!frontIdentity || !behindIdentity || !avatar);

        const style = {
            backgroundColor: disabled ? COLORS.GRAY_1 : COLORS.RED
        } as ViewStyle;

        const txtStyle = {
            color: disabled ? COLORS.GRAY_6 : COLORS.WHITE
        } as TextStyle;

        return (
            <Touchable
                disabled={disabled}
                onPress={uploadFrontIdentify}
                style={[styles.btn, style]}
            >
                <Text style={[styles.txtBt, txtStyle]}>
                    {Languages.identifyConfirm.updateIdentify}
                </Text>
            </Touchable>
        );
    }, [avatar, behindIdentity, frontIdentity, uploadFrontIdentify]);

    return (
        <View style={styles.mainContainer}>
            <HeaderBar hasBack title={Languages.identifyConfirm.title} />
            <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
                <View style={[styles.wrapBottom, styles.shadowColor]}>
                    <View style={styles.wrapDescription}>
                        <Text style={styles.noteTxt}>{Languages.identifyConfirm.note}</Text>
                        <Text style={styles.redTxt}>
                            {Languages.identifyConfirm.photoIdentify}
                        </Text>
                        <Text style={styles.desTxt}>
                            {Languages.identifyConfirm.desIdentify1}
                        </Text>
                        <Text style={styles.desTxt}>
                            {Languages.identifyConfirm.desIdentify2}
                        </Text>
                    </View>
                    {renderImg(Languages.identifyConfirm.up, onTakeFront, frontIdentity)}
                    {renderImg(
                        Languages.identifyConfirm.under,
                        onTakeBehind,
                        behindIdentity
                    )}
                    <View style={styles.wrapDescription}>
                        <Text style={styles.redTxt}>
                            {Languages.identifyConfirm.avatar}
                        </Text>
                        <Text style={styles.desTxt}>
                            {Languages.identifyConfirm.desAvatar1}
                        </Text>
                        <Text style={styles.desTxt}>
                            {Languages.identifyConfirm.desAvatar2}
                        </Text>
                    </View>
                    {renderImg(Languages.identifyConfirm.avatar, onTakeAvatar, avatar)}
                    {renderButtonUpdate}
                </View>
            </ScrollView>
            {isLoading && <MyLoading isOverview />}
        </View>
    );
};

export default IdentifyConfirm;

const styles = StyleSheet.create({
    scroll: {
        paddingBottom: 30
    },
    mainContainer: {
        flex: 1
    },
    wrapBottom: {
        paddingBottom: 8,
        borderRadius: 16,
        marginTop: 16,
        marginBottom: 50,
        marginHorizontal: 16
    },
    shadowColor: {
        shadowColor: COLORS.RED
    },

    value: {
        ...Styles.typography.medium,
        color: COLORS.BLACK
    },
    item2: {
        width: '100%',
        marginBottom: 10
    },
    btn: {
        backgroundColor: COLORS.RED,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 50,
        marginTop: 20
    },
    txtBt: {
        ...Styles.typography.medium,
        color: COLORS.WHITE
    },
    wrapImage: {
        backgroundColor: COLORS.WHITE,
        alignItems: 'center',
        borderRadius: 8,
        borderColor: COLORS.GRAY_7,
        borderWidth: 1,
        marginTop: 10,
        marginBottom: 5,
        padding: 5,
        justifyContent: 'center'
    },
    redTxt: {
        ...Styles.typography.bold,
        color: COLORS.DARK_RED
    },
    desTxt: {
        ...Styles.typography.medium,
        color: COLORS.GRAY_6,
        fontSize: Configs.FontSize.size12
    },
    wrapDescription: {
        marginTop: 5,
        marginBottom: 10
    },
    noteTxt: {
        ...Styles.typography.regular,
        fontSize: Configs.FontSize.size15,
        marginBottom: 10
    },
    image: {
        backgroundColor: COLORS.WHITE,
        marginBottom: 5,
        height: 190,
        width: 160,
        marginTop: 10
    }
});
