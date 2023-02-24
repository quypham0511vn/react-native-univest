import RsaUtils from "@/utils/RsaUtils";
import { ApiService } from "./base-service";
import { API_CONFIG } from "./constants";

export class AuthServices extends ApiService {
  loginPhone = async (phone: string, password: string) =>
    this.api().post(
      API_CONFIG.LOGIN,
      this.buildFormData({
        phone: await RsaUtils.encryptData(phone),
        password: await RsaUtils.encryptData(password),
      })
    );

  registerAuth = async (
    phone: string,
    full_name: string,
    password: string,
    ref_id: string,
    campaign_id?: string
  ) =>
    this.api().post(
      API_CONFIG.REGISTER,
      this.buildFormData({
        password: await RsaUtils.encryptData(password),
        full_name,
        phone: await RsaUtils.encryptData(phone),
        ref_id,
        campaign_id,
      })
    );

  otpActive = async (id: number, otp: string, email: "") =>
    this.api().post(
      API_CONFIG.OTP_ACTIVE,
      this.buildFormData({
        id,
        otp,
        email,
      })
    );

  resendOtp = async (id: string, phone_number: string) =>
    this.api().post(
      API_CONFIG.RESEND_OTP,
      this.buildFormData({
        id,
        phone_number: await RsaUtils.encryptData(phone_number),
      })
    );

  changePwd = async (password_old: string, password_new: string) =>
    this.api().put(API_CONFIG.CHANGE_PWD, {
      password_old: await RsaUtils.encryptData(password_old),
      password_new: await RsaUtils.encryptData(password_new),
    });

  getInformationAuth = async () => this.api().get(API_CONFIG.GET_USER_INFO);

  updateInfoUser = async (
    email?: string,
    birthday?: string,
    full_name?: string,
    tax_code?: string,
    job?: any,
    city?: any,
    ward?: any,
    district?: any,
    gender?: any,
    city_name?: string,
    district_name?: string,
    ward_name?: string,
    ref_id?: string,
    campaign_id?: string
  ) =>
    this.api().put(API_CONFIG.UPDATE_INFO_USER, {
      email: email,
      birthday: birthday,
      full_name: full_name,
      job: job,
      tax_code: tax_code,
      city: city,
      district: district,
      ward: ward,
      gender: gender,
      city_name: city_name,
      district_name: district_name,
      ward_name: ward_name,
      ref_id: ref_id,
      campaign_id: campaign_id,
    });

  updateRefIDUser = async (ref_id?: string, campaign_id?: string) =>
    this.api().put(API_CONFIG.UPDATE_INFO_USER, {
      ref_id: ref_id,
      campaign_id: campaign_id,
    });

  getListBank = async () => this.api().get(API_CONFIG.GET_LIST_BANK);

  updateListBank = async (
    type: string,
    type_card: string,
    bank_code: string | undefined,
    bank_account: string | undefined,
    name_bank_account: string
  ) =>
    this.api().post(
      API_CONFIG.UPDATE_LIST_BANK,
      this.buildFormData({
        type,
        type_card,
        bank_code,
        bank_account,
        name_bank_account,
      })
    );

  moneyMethod = async () => this.api().get(API_CONFIG.MONEY_METHOD);

  loginWithSocial = async (type: string, provider_id: string) =>
    this.api().post(
      API_CONFIG.LOGIN_SOCIAL,
      this.buildFormData({
        type,
        provider_id,
      })
    );

  confirmPhoneNumber = async (id: string, phone_number: string) =>
    this.api().post(
      API_CONFIG.CONFIRM_PHONE_NUMBER,
      this.buildFormData({
        id,
        phone_number: await RsaUtils.encryptData(phone_number),
      })
    );

  linkSocial = async (type: string, provider_id: any, email?: string) =>
    this.api().post(
      API_CONFIG.LINK_SOCIAL,
      this.buildFormData({
        type,
        provider_id,
        email,
      })
    );

  updateNewPwd = async (id: number, password: string, checksum: string) =>
    this.api().post(
      API_CONFIG.UPDATE_NEW_PWD,
      this.buildFormData({
        id,
        password: await RsaUtils.encryptData(password),
        checksum,
      })
    );

  resendPwd = async (phone_number: string) =>
    this.api().post(
      API_CONFIG.RESEND_PWD,
      this.buildFormData({
        phone_number: await RsaUtils.encryptData(phone_number),
      })
    );

  confirmOTPRePwd = async (otp: number, id: number) =>
    this.api().post(
      API_CONFIG.CONFIRM_OTP_FORGOT_PWD,
      this.buildFormData({
        otp,
        id,
      })
    );

  uploadAvatar = async (photo: any) =>
    this.api().post(
      API_CONFIG.UPLOAD_PERSONAL_PHOTO,
      this.buildFormData({
        photo,
      })
    );

  deleteAccount = async () => this.api().post(API_CONFIG.BLOCK_ACCOUNT);

  confirmDeleteAccount = async (otp: any, checksum?: string) =>
    this.api().post(
      API_CONFIG.CONFIRM_BLOCK_ACCOUNT,
      this.buildFormData({ otp, checksum })
    );

  getReferenceInfo = async () => this.api().post(API_CONFIG.REFERENCE_INFO);

  requestSupport = async () => this.api().post(API_CONFIG.REQUEST_SUPPORT);

  updateReference = async (referent_code: string) =>
    this.api().post(
      API_CONFIG.UPDATE_REFERENCE,
      this.buildFormData({ referent_code })
    );

  responseInvite = async (invite_id: string, accept: boolean) =>
    this.api().post(
      API_CONFIG.RESPONSE_INVITE,
      this.buildFormData({ invite_id, accept })
    );
}
