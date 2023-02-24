export type PopupProps = {
    onClose?: () => any;
    onConfirm?: (data?: any) => any;
    onBackdropPress?: () => any;
    content?: string;
    btnText?: string;
};

export type PopupActions = {
    show?: (content?: string) => any;
    showAlert: (title?: string, content?: string) => any;
    showData?: (data: any) => any;
    hide: (content?: string) => any;
    setContent?: (message: string) => void;
    setErrorMsg?: (msg?: string) => void;
};


