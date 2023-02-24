export interface Product {
    id: number;
    product_id: number;
    status: string;
    type: string;
    created_by: string;
    updated_by?: any;
    limit_money: number;
    period: number;
    date_interest: number;
    created_at: number;
    updated_at: number;
    type_interest: number;
    maintain: string;
}

export interface Transaction {
    id: number;
    title: string;
    value: string;
    color: string;
    time: string;
}

export interface ContractModel {
    product: Product;
    effect: Transaction[];
    payment: Transaction[];
    pending: Transaction[];
    expire: Transaction[];
    transaction: Transaction[];
    temporary: Transaction[];
}
