import { NotificationPopupModel } from "./notification-popup";

export interface NotificationModel {
  created_at?: any;
  description?: string;
  data: Array<NotificationPopupModel>;
  title: string;
  id?: number;
  status?: number;
  items?: Array<NotificationPopupModel>;
}
