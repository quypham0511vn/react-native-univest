import { Platform } from 'react-native';
import { stringMd5 } from 'react-native-quick-md5';


import { ApiService } from './base-service';
import { API_CONFIG } from './constants';
import RsaUtils from '@/utils/RsaUtils';

export class PaymentServices extends ApiService {

    requestTopUp = async (payment_source: string, amount_money: string, interest_id: string) => this.api().post(API_CONFIG.REQUEST_TOP_UP,
        this.buildFormData({
            payment_source,
            amount_money: await RsaUtils.encryptData(`${amount_money}`),
            interest_id,
            checksum: stringMd5(JSON.stringify({ amount_money })),
            client_code: Platform.OS
        }));

    withdrawToUnlimitedPeriod = async (id: number) => this.api().post(API_CONFIG.WITHDRAW_TO_UNLIMITED_PERIOD,
        this.buildFormData({
            id
        }));

    calculateWithdrawToUnlimitedPeriod = async (id: number, date_pay: string) => this.api().post(API_CONFIG.CALCULATE_WITHDRAW_TO_UNLIMITED_PERIOD,
        this.buildFormData({
            id,
            date_pay
        }));

    withdrawPayment = async (id: string, amount_money: string) =>
        this.api().post(
            API_CONFIG.WITHDRAW_PAYMENT,
            this.buildFormData({
                id,
                amount_money: await RsaUtils.encryptData(`${amount_money}`),
                checksum: stringMd5(JSON.stringify({ amount_money }))
            })
        );

    requestWithdrawOTP = async (transaction_id: string, payment_source: string) =>
        this.api().post(
            API_CONFIG.REQUEST_WITHDRAW_OTP,
            this.buildFormData({
                transaction_id,
                payment_source
            })
        );

    sourcePayment = async (transaction_id: string, payment_source: string, checksum: string, otp: string) =>
        this.api().post(
            API_CONFIG.SOURCE_PAYMENT,
            this.buildFormData({
                transaction_id,
                payment_source,
                checksum,
                otp
            })
        );

    sendPaymentOtp = async (transaction_id: string, payment_source: string) =>
        this.api().post(
            API_CONFIG.SEND_PAYMENT_OTP,
            this.buildFormData({
                transaction_id,
                payment_source
            })
        );

    resendPaymentOtp = async (transaction_id: string, payment_source: string) =>
        this.api().post(
            API_CONFIG.RESEND_PAYMENT_OTP,
            this.buildFormData({
                transaction_id,
                payment_source
            })
        );

}

