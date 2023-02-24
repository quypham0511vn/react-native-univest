import Languages from '@/commons/Languages';

export type TouchIDProps = {
  handlePopupDismissed?: () => any;
  description?: string;
  title?: string;
  onAuthenticate: () => any;
  popupShowed?: boolean;
  showPopupAlert?: (error: any) => any;
  biometryType?:string
};
export enum ENUM_BIOMETRIC_TYPE {
   TOUCH_ID='TouchID',
   FACE_ID='FaceID',
   KEY_PIN='KEY_PIN'
}
export enum ERROR_BIOMETRIC {
  // ios
  RCTTouchIDNotSupported='RCTTouchIDNotSupported',
  RCTTouchIDUnknownError='RCTTouchIDUnknownError',
  LAErrorTouchIDNotEnrolled='LAErrorTouchIDNotEnrolled',
  LAErrorTouchIDNotAvailable='LAErrorTouchIDNotAvailable',
  // android
  NOT_SUPPORTED='NOT_SUPPORTED',
  NOT_AVAILABLE='NOT_AVAILABLE',
  NOT_ENROLLED='NOT_ENROLLED',
  FINGERPRINT_ERROR_LOCKOUT_PERMANENT='FINGERPRINT_ERROR_LOCKOUT_PERMANENT',
  ErrorFaceId='ErrorFaceId',
}
export function messageError(value: string) {
    switch (value) {
        case ERROR_BIOMETRIC.RCTTouchIDNotSupported:
            return Languages.errorBiometryType.RCTTouchIDNotSupported; 
        case ERROR_BIOMETRIC.RCTTouchIDUnknownError:
            return Languages.errorBiometryType.RCTTouchIDUnknownError;
        case ERROR_BIOMETRIC.LAErrorTouchIDNotEnrolled:
            return Languages.errorBiometryType.LAErrorTouchIDNotEnrolled;
        case ERROR_BIOMETRIC.LAErrorTouchIDNotAvailable:
            return Languages.errorBiometryType.LAErrorTouchIDNotAvailable;
        case ERROR_BIOMETRIC.NOT_ENROLLED:
            return Languages.errorBiometryType.NOT_ENROLLED;
        case ERROR_BIOMETRIC.ErrorFaceId:
            return Languages.errorBiometryType.ErrorFaceId;
        default:
            return Languages.errorBiometryType.NOT_DEFINE;
    }
}

