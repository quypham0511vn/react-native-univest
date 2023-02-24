export interface PaymentMethodModel {
    key: string;
    code: string;
    title: string;
    description: string;
    enable: boolean;
    status: string;
    wallet_balance: string;
}
export interface BankInformationModel {
    key: number,
    url: string,
    account: string;
    bin: string;
    description: string;
    money: string;
    name_account: string;
    name_bank: string;
    bill_id: string;
}
