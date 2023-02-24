import { Id } from './id';

export interface AssetsModel {
    _id: Id;
}
export interface AssetsModelData {
    total_money_all: string;
    color_total_money_all: string;
    beginning_asset: string;
    color_beginning_asset: string;
    pay_in: string;
    color_pay_in: string;
    pay_out: string;
    color_pay_out: string;
    end_asset: string;
    color_end_asset: string;
    growth: string;
    color_growth: string;
    rate: string;
    color_rate: string;
    id: number;
    type_period: number;
    name: string;
    interest_received: string;
    color_interest_received: string;
    provisional_interest: string;
    color_provisional_interest: string;
    period: number;
    slug: string;
    product: string;
    wallet_id: number;
    contract_id: number;
    custody_wallet: number;
}
export interface TypeAssetsModel {
    contracts: AssetsModelData[];
    total?: AssetsModelData;
}
