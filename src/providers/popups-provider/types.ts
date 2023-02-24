export type PopupContextValue = {
    show: (params?: PopupData) => void;
    close: () => void;
};

export type PopupData = {
    data: any,
    status?: Number;
};
