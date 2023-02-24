import { useCallback, useEffect } from 'react';
import TouchID from 'react-native-touch-id';

import Languages from '@/commons/Languages';
import { COLORS } from '@/theme';
import { TouchIDProps } from './types';

const optionalConfigObject = {
    imageColor: COLORS.WHITE, // Android
    // imageErrorColor: '#ff0000', // Android
    // sensorDescription: Languages.authentication.sensorDescription, // Android
    // sensorErrorDescription: Languages.authentication.sensorErrorDescription, // Android
    // cancelText: Languages.authentication.cancelText, // Android
    unifiedErrors: true, // use unified error messages (default false)
    passcodeFallback: false // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
};

const TouchIDPopup = ({
    handlePopupDismissed,
    onAuthenticate,
    showPopupAlert
}: TouchIDProps) => {
    const auth = useCallback(() => {
        return TouchID.authenticate(
            Languages.quickAuThen.description,
            optionalConfigObject
        )
            .then(() => {
                handlePopupDismissed?.();
                onAuthenticate();
            })
            .catch((error: any) => {
                console.log(error.message);
                handlePopupDismissed?.();
            });
    }, [handlePopupDismissed, onAuthenticate]);
    useEffect(() => {
        auth();
        return () => {
            handlePopupDismissed?.();
        };
    }, [auth, handlePopupDismissed]);

    return null;
};
export default TouchIDPopup;
