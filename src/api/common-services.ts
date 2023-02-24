import qs from "query-string";

import Utils from "@/utils/Utils";
import { ApiService } from "./base-service";
import { API_CONFIG } from "./constants";

export class CommonServices extends ApiService {
  getProduces = async () => this.api().get(API_CONFIG.GET_PRODUCT);

  getProducesV1 = async () => this.api().get(API_CONFIG.GET_PRODUCT_V1);

  getProductDetails = async (id?: number) =>
    this.api().get(`${API_CONFIG.GET_PRODUCT_DETAILS}/${id}`, {});

  getCity = async () => this.requestSavedData(API_CONFIG.GET_CITY, {});

  getDistrict = async (id?: number) =>
    this.requestSavedData(`${API_CONFIG.GET_DiSTRICT}/${id}`, {});

  getWard = async (id?: number) =>
    this.requestSavedData(`${API_CONFIG.GET_WARD}/${id}`, {});

  getGender = async () => this.requestSavedData(API_CONFIG.GET_GENDER);

  getJobs = async () => this.requestSavedData(API_CONFIG.GET_LIST_JOBS);

  getPaymentMethod = async (amount: any, packageId?: any) => {
    const query = { amount, packageId };
    return this.api().get(
      `${API_CONFIG.GET_PAYMENT_METHOD}?${qs.stringify(query)}`
    );
  };

  getNews = async () => this.api().get(API_CONFIG.GET_NEWS);

  getNewsAboutUs = async () => this.api().get(API_CONFIG.GET_ABOUT_US);

  getIntroduce = async (id: any) =>
    this.api().get(`${API_CONFIG.INTRODUCE}/${id}`);

  getIntroduceGroup = async (id: any) =>
    this.api().get(`${API_CONFIG.INTRODUCE_GROUP}/${id}`);

  getIntroduceGeneral = async () =>
    this.api().get(API_CONFIG.INTRODUCE_GENERAL);

  sendFcmToken = async (device_token: string) =>
    this.api().post(
      API_CONFIG.SEND_FCM_TOKEN,
      this.buildFormData({
        device_token,
      })
    );
  deleteToken = async () => this.api().post(API_CONFIG.DELETE_TOKEN);
}
