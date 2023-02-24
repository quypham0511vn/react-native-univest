export interface TransactionModel {
    code: string;
    id: number;
    title: string;
    status: number;
    type: number;
    money: string;
    text_status: string;
    source: string;
    receiving_source: string;
    transfer_source: string;
    color: string;
    color_status: string;
    created_at: string;
}
export interface TransactionDetailModel {
    id: number;
    key: string;
    value: string;
    color: string;
    created_at: string;
    money_interest: string;
    title: string;
    total_amount: string;
}
