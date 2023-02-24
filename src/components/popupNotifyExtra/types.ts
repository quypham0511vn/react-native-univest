export type PopupProps = {
    onClose?: () => any;
    onConfirm?: () => any;
    onBackdropPress?: () => any;
    onSuccessPress?: () => any;
    onCodeChanged?: () => any;
    onPressAction?: (action: any) => any;
    onSuccess?: any;
    content?: string;
    btnText?: string;
    description?:string;
    title?:string,
    isIcon?:boolean,
    icon?: any,
    hasButton?: boolean,
    keyCode?: any,
    webView?: string
};

export type PopupActions = {
    show: (content?: string) => any;
    showCustom?: (title: string, content: string) => any;
    showData: (data: any) => any;
    hide: (content?: string) => any;
    setContent?: (message: string) => void
};


