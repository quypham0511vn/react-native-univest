import DateUtils from '@/utils/DateUtils';
import { ApiService } from './base-service';
import { API_CONFIG } from './constants';

export class TransactionServices extends ApiService {

    getTransactions = async (option: number, offset: number, limit: number, start?: Date, end?: Date) => this.api().get(API_CONFIG.GET_TRANSACTION,
        {
            option,
            start: start ? DateUtils.getServerDateFormat(start.toDateString()) : '',
            end: end ? DateUtils.getServerDateFormat(end.toDateString()) : '',
            offset,
            limit
        });

    getTransactionDetail = async (id: number) => this.api().get(`${API_CONFIG.TRANSACTION_DETAIL}/${id}`);
    
    deleteTransactionProcessing = async (id: string) => this.api().post(`${API_CONFIG.DELETE_TRANSACTIONS_PROCESSING}`, this.buildFormData({id}))

    checkBill = async (bill_id: string) => this.api().post(API_CONFIG.CHECK_TRANSACTION, this.buildFormData({ bill_id }));
}

