export interface UserInfoModel {
  id: number;
  email: string;
  phone: string;
  password: string;
  pin_code: string;
  type_password: string;
  full_name: string;
  status: string;
  type: number;
  channels: any;
  avatar: any;
  token_active: string;
  timeExpried_active: string;
  investor_reviews: any;
  token_web: any;
  token_app: string;
  card_back: any;
  front_facing_card: any;
  identity: any;
  identifier: any;
  created_by: string;
  date_identity: string;
  address_identity: string;
  token_reset_password: any;
  time_token_exprired_reset_password: any;
  source: any;
  data_source: any;
  referral_code: any;
  is_admin: boolean;
  is_asset: boolean;
  is_ctv: boolean;
  accuracy: number;
  updated_by: any;
  birthday: any;
  type_payment: any;
  affiliate: boolean;
  created_at: number;
  updated_at: number;
  job: string;
  tax_code: string;
  city: string;
  district: string;
  ward: string;
  last_login: string;
  address: string;
  sex: string;
  birth_date: string;
  gender: string;
  ward_name: string;
  district_name: string;
  city_name: string;
  job_name: string;
  gender_name: string;
  id_facebook?: string;
  id_google?: string;
  id_apple?: string;
  personal_photo?: string;
  referral_id?: string;
  dynamic_link?: string;
}
export interface InForUser {
  full_name: string;
  birthday: string;
  phone: string;
  job: string;
  tax_code: string;
  email: string;
  city: any;
  district: any;
  ward: any;
  identity: string;
}

export interface MoneyMethodModal {
  key: string;
  title: string;
  status: string;
  name: string;
  bank_name: string;
  icon: string;
  account: string;
  enable: boolean;
  type: string;
  bank_account: string;
}

export interface LoginSocialModal {
  status: string;
  type: number;
  created_by: string;
  id_facebook: string;
  id: number;
  token: string;
}
