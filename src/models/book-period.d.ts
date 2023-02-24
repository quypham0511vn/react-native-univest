import { Transaction } from './contract';

export interface Product {
    id: number;
    title: string;
}

export interface BookPeriodModel {
    product: Product;
    contract: Transaction[];
}
