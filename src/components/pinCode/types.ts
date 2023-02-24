import { TextStyle, ViewStyle } from 'react-native';

export namespace PinCodeT {
    export interface PinCodeT {
        visible: boolean;
        mode: Modes;
        options?: Options;
        textOptions?: TextOptions,
        titleContainerStyle?: ViewStyle | ViewStyle[];
        titleStyle?: TextStyle | TextStyle[];
        subTitleStyle?: TextStyle | TextStyle[];
        pinContainerStyle?: ViewStyle | ViewStyle[];
        buttonContainerStyle?: ViewStyle | ViewStyle[];
        buttonsStyle?: ViewStyle | ViewStyle[];
        buttonTextStyle?: TextStyle | TextStyle[];
        footerStyle?: ViewStyle | ViewStyle[];
        footerTextStyle?: TextStyle | TextStyle[];
        mainStyle?:ViewStyle|ViewStyle[],
        onEnterSuccess?: (pin: string) => void;
        onSetSuccess?: (pin: string) => void;
        onSetCancel?: () => void;
        onResetSuccess?: () => void;
        onModeChanged?: (lastMode: Modes, newMode?: Modes) => void;
        checkPin?: (pin: string) => Promise<boolean>;
    }

    export enum Modes {
        Enter = 'enter',
        Set = 'set',
        Locked = 'locked',
        Reset = 'reset'
    }

    export enum Statuses {
        Initial = 'initial',
        SetOnce = 'set.once',
        CheckPin='check.pin',
        ResetPrompted = 'reset.prompted',
        ResetSucceeded = 'reset.succeeded'
    }

    export interface Options {
        pinLength?: number;
        disableLock?: boolean;
        lockDuration?: number;
        maxAttempt?: number;
        allowReset?: boolean;
    }

    export interface TextOptions {
        enter?: {
            title?: string;
            subTitle?: string;
            error?: string;
            backSpace?: string;
            footerText?: string;
        },
        set?: {
            title?: string;
            subTitle?: string;
            repeat?: string;
            error?: string;
            cancel?: string;
            footerText?:string
        },
        
    }
}

export const DEFAULT = {
    Options: {
        pinLength: 4,
        allowReset: true,
        disableLock: false,
        lockDuration: 600000,
        maxAttempt: 10
    },
    TextOptions: {
        enter: {
            title: 'Enter PIN',
            subTitle: 'Enter {{pinLength}}-digit PIN to access.',
            error: 'Wrong PIN! Try again.',
            backSpace: 'Delete',
            footerText: 'Forgot PIN?'
        },
        set: {
            title: 'Set up a new PIN',
            subTitle: 'Enter {{pinLength}} digits.',
            repeat: 'Enter new PIN again.',
            error: 'PIN don\'t match. Start the process again.',
            cancel: 'Cancel'
        }
      
    }
};


export const PIN_KEY = '@pincode';
