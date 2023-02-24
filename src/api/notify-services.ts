import { API_CONFIG } from "./constants";
import { ApiService } from "./base-service";

export class NotifyServices extends ApiService {

    getNotify = async (page: number, limit: number, category_id: number) =>
        this.api(API_CONFIG.BASE_URL_NOTIFICATION).get(API_CONFIG.GET_LIST_NOTIFY, {
            page,
            limit,
            category_id,
        });

    getNotifyOld = async (offset: number, limit: number) =>
        this.api().post(
            API_CONFIG.GET_LIST_NOTIFY_OLD,
            this.buildFormData({
                offset,
                limit
            })
        );


    getNotifyPopup = async () => this.api(API_CONFIG.BASE_URL_NOTIFICATION).get(API_CONFIG.GET_NOTIFY_POPUP);

    getNotifyDetail = async (id: number) =>
        this.api(API_CONFIG.BASE_URL_NOTIFICATION).get(API_CONFIG.GET_NOTIFY_DETAIL + "/" + id);

    getNotifyCount = async () => this.api(API_CONFIG.BASE_URL_NOTIFICATION).get(API_CONFIG.COUNT_NOTIFY);

    getNotifyCountOld = async () => this.api().get(API_CONFIG.COUNT_NOTIFY_OLD);

    updateNotify = async (id: number) =>
        this.api(API_CONFIG.BASE_URL_NOTIFICATION).post(API_CONFIG.READ_NOTIFY, { id });


    updateNotifyOld = async (id: number) => this.api().post(API_CONFIG.READ_NOTIFY_OLD, { id });

    // category
    getNotifyCategory = async () => this.api(API_CONFIG.BASE_URL_NOTIFICATION).get(API_CONFIG.GET_CATEGORY);
}
