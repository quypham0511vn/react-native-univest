import SessionManager from '@/managers/SessionManager';
import DateUtils from '@/utils/DateUtils';
import { ApiService } from './base-service';
import { API_CONFIG } from './constants';

export class AssetsServices extends ApiService {
    today = DateUtils.getServerDateFormat(new Date().toDateString());

    getAllAssets = async () => this.api().get(API_CONFIG.GET_ASSETS_USER, {
        start_date: SessionManager.currentFilterStartDate,
        end_date: this.today
    });

    getListAssets = async () => this.api().get(API_CONFIG.GET_LIST_ASSETS, {
        start_date: SessionManager.currentFilterStartDate,
        end_date: this.today
    });

    getDetailsAssets = async (id: number) => this.api().get(API_CONFIG.GET_DETAILS_ASSETS, {
        id,
        start_date: SessionManager.currentFilterStartDate,
        end_date: this.today
    });

    getAccumulatedAsset = async (id: number) => this.api().get(API_CONFIG.SHOW_ASSET, {
        id,
        start_date: SessionManager.currentFilterStartDate,
        end_date: this.today
    });

    getTransactionContract = async (id: number) => this.api().get(`${API_CONFIG.ACCUMULATED_TRANSACTIONS}/${id}`);

    getContractInfo = async (id: number) => this.api().get(`${API_CONFIG.CONTRACT_INFO}/${id}`);

    getTimingAssets = async (id: number, option: number, limit: number, offset: number) => this.api().get(API_CONFIG.GET_TIMING_ASSETS, {
        id,
        option,
        limit,
        offset,
        start_date: SessionManager.currentFilterStartDate,
        end_date: this.today
    });

    getInterestHistory = async (limit: number, offset: number) => this.api().get(API_CONFIG.INTEREST_HISTORY, {
        limit,
        offset
    });

    getPendingTransaction = async (limit: number, offset: number) => this.api().post(API_CONFIG.PENDING_TRANSACTION, this.buildFormData({
        limit,
        offset
    }));

    getTempTransaction = async (limit: number, offset: number) => this.api().post(API_CONFIG.TEMP_TRANSACTION, this.buildFormData({
        limit,
        offset
    }));

    updateInvestMethod = async (id: number, type: number) => this.api().post(API_CONFIG.UPDATE_INVEST_METHOD, {
        id,
        type
    });

    transactionsByProduct = async (id: number, limit: number, offset: number) => this.api().get(API_CONFIG.TRANSACTIONS_BY_PRODUCT, {
        id,
        limit,
        offset
    });

    estimateInvest = async (amount_money: string, interest_id: string) => this.api().post(API_CONFIG.ESTIMATE_INVEST, this.buildFormData({
        amount_money,
        interest_id
    }));

    sendOtp = async () => this.api().post(API_CONFIG.SEND_OTP);
}

