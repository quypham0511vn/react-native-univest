import { ProductModel } from './product';

export interface TransactionFlowModel {
    product: ProductModel,
    id: string,
    packageId: string,
    billId: string,
    isInvest?: boolean,
    amount: string,
    title: string,
    url: string
    isUnlimited: boolean
}
