import { TransactionDetailModel } from './transaction';

export interface BookModel {
    id: number;
    title: string;
    transaction: TransactionDetailModel[];
    info: Info[];
}

export interface Info {
    key: string;
    color: string;
    value: any;
    status: boolean;
}
