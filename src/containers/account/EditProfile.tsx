import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { observer } from 'mobx-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Configs } from '@/commons/Configs';
import Languages from '@/commons/Languages';
import { HeaderBar, Touchable } from '@/components';
import { ItemProps } from '@/components/BottomSheetAddress';
import { MyTextInput } from '@/components/elements/textfield';
import { TextFieldActions } from '@/components/elements/textfield/types';
import MyDatePicker, { MyDatePickerActions } from '@/components/MyDatePicker';
import MyLoading from '@/components/MyLoading';
import PickerValuationAddress from '@/components/PickerValuationAddress';
import { PopupActions } from '@/components/popup/types';
import ScrollViewWithKeyboard from '@/components/ScrollViewWithKeyboard';
import { useAppStore } from '@/hooks';
import SessionManager from '@/managers/SessionManager';
import { CityModal, DistrictModal, WardModal } from '@/models/address';
import { InForUser, UserInfoModel } from '@/models/user-model';
import Navigator from '@/routers/Navigator';
import { COLORS, Styles } from '@/theme';
import DateUtils from '@/utils/DateUtils';
import FormValidate from '@/utils/FormValidate';
import ToastUtils from '@/utils/ToastUtils';

const inFor: InForUser[] = [
    {
        full_name: '',
        birthday: '',
        phone: '',
        job: '',
        tax_code: '',
        email: '',
        city: '',
        district: '',
        ward: '',
        identity: ''
    }
];
const EditProfile = observer(() => {
    const { apiServices, userManager } = useAppStore();

    const [values, setValue] = useState<InForUser[]>(inFor);

    const [birthDate, setBirthDate] = useState<string>('');
    const [affiliate, setAffiliate] = useState<boolean>(false);
    const verifiedUser = userManager?.userInfo?.accuracy === 1;

    const [dataProvince, setDataProvince] = useState<ItemProps[]>([]);
    const [dataDistrict, setDataDistrict] = useState<ItemProps[]>([]);
    const [dataWards, setDataWards] = useState<ItemProps[]>([]);
    const [gender, setGender] = useState<ItemProps[]>();
    const [dataJobs, setDataJobs] = useState<ItemProps[]>();

    const [job, setJob] = useState<ItemProps>();
    const [genderValue, setGenderValue] = useState<ItemProps>();
    const [city, setCity] = useState<ItemProps>();
    const [district, setDistrict] = useState<ItemProps>();
    const [ward, setWard] = useState<ItemProps>();

    const userNameRef = useRef<TextFieldActions>(null);
    const birthdayRef = useRef<MyDatePickerActions>(null);
    const phoneRef = useRef<TextFieldActions>(null);
    const taxIdRef = useRef<TextFieldActions>(null);
    const emailRef = useRef<TextFieldActions>(null);

    const provinceRef = useRef<PopupActions>(null);
    const districtRef = useRef<PopupActions>(null);
    const wardsRef = useRef<PopupActions>(null);
    const genderRef = useRef<PopupActions>(null);
    const jobRef = useRef<PopupActions>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchListJobs = useCallback(async () => {
        const res = await apiServices.common.getJobs();
        if (res.success) {
            const data = res.data as [];
            const items = [] as ItemProps[];
            const temp = Object.entries(data);
            temp.map((item: any) => {
                return items.push({
                    id: item[0],
                    name: item[1]
                });
            });
            setDataJobs(items);
        }
    }, [apiServices.common]);

    const fetchGender = useCallback(async () => {
        const res = await apiServices.common.getGender();
        if (res.success) {
            const data = res.data as [];
            const items = [] as ItemProps[];
            const temp = Object.entries(data);
            temp.map((item: any) => {
                return items.push({
                    id: item[0],
                    name: item[1]
                });
            });
            setGender(items);
        }
    }, [apiServices.common]);

    const fetchCity = useCallback(async () => {
        const resCity = await apiServices.common.getCity();
        if (resCity.success) {
            const data = resCity?.data as CityModal[];
            const temp = data?.map((item) => {
                return { id: item?.code, name: item?.name };
            }) as ItemProps[];
            setDataProvince(temp);
        }
    }, [apiServices.common]);

    const fetchDistrict = useCallback(
        async (id: number) => {
            const res = await apiServices.common.getDistrict(id);
            if (res.success) {
                const data = res?.data as DistrictModal[];
                const temp = data?.map((item) => {
                    return { id: item?.code, name: item?.name };
                }) as ItemProps[];
                setDataDistrict(temp);
            }
        },
        [apiServices.common]
    );

    const fetchWard = useCallback(
        async (id: number) => {
            const res = await apiServices.common.getWard(id);
            if (res.success) {
                const data = res?.data as WardModal[];
                const temp = data?.map((item) => {
                    return { id: item?.code, name: item?.name };
                }) as ItemProps[];
                setDataWards(temp);
            }
        },
        [apiServices.common]
    );

    const onChangeCity = useCallback(
        async (item: any) => {
            setCity(item);
            fetchDistrict(item?.id);
            setDistrict({});
            setDataWards([]);
            setWard({});
        },
        [fetchDistrict]
    );
    const onChangeDistrict = useCallback(
        async (item: any) => {
            setDistrict(item);
            setWard({});
            fetchWard(item?.id);
        },
        [fetchWard]
    );

    const onChangeWard = useCallback(async (item: any) => {
        setWard(item);
    }, []);

    const onChangeJob = useCallback((item: any) => {
        setJob(item);
    }, []);

    const onChangeGender = useCallback((item: any) => {
        console.log(item);
        setGenderValue(item);
    }, []);

    const onChangeText = useCallback(
        (value: string, tag?: string) => {
            switch (tag) {
                case Languages.information.fullName:
                    values[0].full_name = value;
                    break;
                case Languages.information.phone:
                    values[0].phone = value;
                    break;
                case Languages.information.taxId:
                    values[0].tax_code = value;
                    break;
                case Languages.information.email:
                    values[0].email = value;
                    break;
                default:
                    break;
            }
        },
        [values]
    );

    const onValidation = useCallback(() => {

        const errMsgUsername = values[0].full_name && FormValidate.userNameValidate(values[0].full_name);
        const errMsgPhone = FormValidate.passConFirmPhone(values[0].phone);
        const errMsgEmail = values[0].email && FormValidate.emailValidate(values[0].email);
        const errMsgTaxId = values[0].tax_code && FormValidate.taxCodeValidate(
            values[0].tax_code,
            Languages.errorMsg.taxIdEmpty,
            Languages.errorMsg.taxIdSyntax,
            Languages.errorMsg.specialCharacters
        );

        userNameRef.current?.setErrorMsg(errMsgUsername);
        phoneRef.current?.setErrorMsg(errMsgPhone);
        emailRef.current?.setErrorMsg(errMsgEmail);
        taxIdRef.current?.setErrorMsg(errMsgTaxId);
        if (
            `${errMsgUsername}${errMsgPhone}${errMsgEmail}${errMsgTaxId}`
                .length === 0
        ) {
            return true;
        }

        return false;
    }, [values]);

    const onUpdateInfoUser = useCallback(async () => {
        if (onValidation()) {
            setIsLoading(true);
            // console.log('birth', DateUtils.getDateFromServer(birthDate));
            const res = await apiServices.auth.updateInfoUser(
                values[0].email?.trim() || '',
                DateUtils.getDateFromServer(birthDate) || '',
                values[0].full_name?.trim() || '',
                values[0]?.tax_code || '',
                job?.id,
                city?.id || '0',
                ward?.id || '0',
                district?.id || '0',
                genderValue?.id || '',
                city?.name || '0',
                district?.name || '0',
                ward?.name || '0'
            );
            if (res.success) {
                const data = res.data as UserInfoModel;

                userManager?.updateUserInfo({
                    ...data,
                    city_name: city?.name,
                    district_name: district?.name,
                    ward_name: ward?.name,
                    job_name: job?.name,
                    gender_name: genderValue?.name,
                    gender: genderValue?.id,
                    affiliate
                });
                setIsLoading(false);
                ToastUtils.showSuccessToast(Languages?.editProfile?.updateSuccess);
                setTimeout(() => {
                    Navigator?.goBack();
                }, 500);
            }
            setIsLoading(false);
        }
    }, [affiliate, apiServices.auth, birthDate, city?.id, city?.name, district?.id, district?.name, genderValue?.id, genderValue?.name, job?.id, job?.name, onValidation, userManager, values, ward?.id, ward?.name]);

    useEffect(() => {
        fetchGender();
        fetchCity();
        fetchListJobs();
        
        if (userManager?.userInfo) {
            setGenderValue({
                id: userManager?.userInfo?.gender || '',
                name: userManager?.userInfo?.gender_name || ''
            });
            setJob({
                id: Number(userManager?.userInfo?.job) || 0,
                name: userManager?.userInfo?.job_name || ''
            });
            setCity({
                id: Number(userManager?.userInfo?.city) || 0,
                name: userManager?.userInfo?.city_name || ''
            });
            setDistrict({
                id: Number(userManager?.userInfo?.district) || 0,
                name: userManager?.userInfo?.district_name
            });
            setWard({
                id: Number(userManager?.userInfo?.ward) || 0,
                name: userManager?.userInfo?.ward_name || ''
            });
            setBirthDate(DateUtils.getDateFromClient(SessionManager.userInfo?.birthday));
            fetchDistrict(parseInt(userManager?.userInfo?.city, 10));
            fetchWard(parseInt(userManager?.userInfo?.district, 10));
            setAffiliate(userManager?.userInfo?.affiliate);
        }
    }, []);


    const renderItem = useCallback(
        (_label: string, _ref: any, _value: any, _type?: any, isDisable?: boolean, number?: number, capitalize?: string) => {
            return (
                <View style={styles.wrapInput}>
                    <MyTextInput
                        ref={_ref}
                        label={_label}
                        value={_value}
                        containerInput={styles.containerStyle}
                        inputStyle={styles.inputStyle}
                        maxLength={number}
                        hasUnderline={false}
                        placeHolder={_label}
                        onChangeText={onChangeText}
                        keyboardType={_type}
                        disabled={isDisable}
                        capitalize={capitalize || 'none'}
                    />
                </View>
            );
        },
        [onChangeText]
    );

    const onConfirmValue = (date: string) => {
        console.log(date);
        setBirthDate(date);
    };

    return (
        <BottomSheetModalProvider>
            <View style={styles.container}>
                <HeaderBar title={Languages.editProfile.title} />
                <ScrollViewWithKeyboard
                    showsVerticalScrollIndicator={false}
                    style={styles.wrapContent}
                >
                    {renderItem(
                        Languages.information.fullName,
                        userNameRef,
                        SessionManager.userInfo?.full_name?.trim() || '',
                        'DEFAULT',
                        verifiedUser,
                        50,
                        'characters'
                    )}

                    {verifiedUser ? renderItem(
                        Languages.information.birthday,
                        birthdayRef,
                        DateUtils.getDateFromClient(SessionManager.userInfo?.birthday),
                        'DEFAULT',
                        true,
                        50
                    ) : <MyDatePicker
                        ref={birthdayRef}
                        title={Languages.information.birthday}
                        onConfirmDatePicker={onConfirmValue}
                        dateString={birthDate || SessionManager.userInfo?.birthday}
                        maximumDate={new Date()}
                        date={new Date()} />
                    }

                    <PickerValuationAddress
                        ref={genderRef}
                        label={Languages.information.sex}
                        containerStyle={styles.picker}
                        data={gender}
                        onPressItem={onChangeGender}
                        value={genderValue?.name || SessionManager.userInfo?.gender_name}
                        styleText={styles.inputStyle}
                        isBasicBottomSheet={true}
                        placeholder={Languages.information.sex}
                    />
                    {renderItem(
                        Languages.information.phone,
                        phoneRef,
                        SessionManager.userInfo?.phone || '',
                        'NUMBER',
                        true,
                        10
                    )}
                    <PickerValuationAddress
                        ref={jobRef}
                        label={Languages.information.job}
                        containerStyle={styles.picker}
                        data={dataJobs}
                        onPressItem={onChangeJob}
                        value={job?.name || SessionManager.userInfo?.job_name}
                        styleText={styles.inputStyle}
                        isBasicBottomSheet={true}
                        placeholder={Languages.information.job}
                    />
                    {renderItem(
                        Languages.information.taxId,
                        taxIdRef,
                        SessionManager.userInfo?.tax_code || '',
                        'DEFAULT',
                        false,
                        13
                    )}
                    {renderItem(
                        Languages.information.email,
                        emailRef,
                        SessionManager.userInfo?.email?.trim() || '',
                        'EMAIL',
                        false,
                        50
                    )}
                    <View style={styles.row}>
                        <Text style={styles.label}>{Languages.information.address}</Text>
                        <View style={styles.border}></View>
                    </View>
                    <PickerValuationAddress
                        label={Languages.information.city}
                        ref={provinceRef}
                        containerStyle={styles.picker}
                        value={city?.name}
                        data={dataProvince}
                        onPressItem={onChangeCity}
                        placeholder={Languages.information.city}
                        styleText={styles.inputStyle}
                        isBasicBottomSheet={true}
                    />

                    <PickerValuationAddress
                        ref={districtRef}
                        label={Languages.information.district}
                        containerStyle={styles.picker}
                        value={district?.name}
                        data={dataDistrict}
                        onPressItem={onChangeDistrict}
                        placeholder={Languages.information.city}
                        styleText={styles.inputStyle}
                        isBasicBottomSheet={true}
                    />
                    <PickerValuationAddress
                        ref={wardsRef}
                        label={Languages.information.village}
                        containerStyle={styles.picker}
                        value={ward?.name}
                        data={dataWards}
                        onPressItem={onChangeWard}
                        placeholder={Languages.information.village}
                        styleText={styles.inputStyle}
                        isBasicBottomSheet={true}
                    />

                    <Touchable onPress={onUpdateInfoUser} style={styles.btn}>
                        <Text style={styles.txtBt}>{Languages.editProfile.updateInfo}</Text>
                    </Touchable>
                </ScrollViewWithKeyboard>
                {isLoading && <MyLoading isOverview />}

            </View>
        </BottomSheetModalProvider>
    );
});

export default EditProfile;
const styles = StyleSheet.create({
    container: {
        paddingBottom: Configs.IconSize.size80
    },
    input: {
        borderWidth: 1,
        marginVertical: 10
    },
    containerStyle: {
        height: Configs.FontSize.size45,
        marginTop: 10,
        borderWidth: 1,
        borderColor: COLORS.GRAY_7
    },
    inputStyle: {
        color: COLORS.BLACK_PRIMARY,
        fontSize: Configs.FontSize.size14
    },
    wrapInput: {
        marginBottom: 10
    },
    wrapContent: {
        marginHorizontal: 16,
        marginTop: 20
    },
    label: {
        color: COLORS.BLACK_PRIMARY
    },
    border: {
        height: 1,
        width: '100%',
        backgroundColor: COLORS.GRAY_7,
        marginLeft: 10
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10
    },
    picker: {
        marginVertical: 10,
        borderColor: COLORS.GRAY_10
    },
    btn: {
        backgroundColor: COLORS.RED,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 5,
        marginBottom: 50,
        marginTop: 20,
        marginHorizontal: 20
    },
    txtBt: {
        ...Styles.typography.medium,
        color: COLORS.WHITE
    }
});

