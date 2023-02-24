
import Languages from '@/commons/Languages';
import ToastUtils from '@/utils/ToastUtils';
import Utils from '@/utils/Utils';
import { ApiService } from './base-service';
import { API_CONFIG } from './constants';

export class ImageServices extends ApiService {

    uploadImage = async (file: any, lbMsg?: string) => {

        const form = new FormData();
        form.append('file', {
            uri: file.path || '',
            name: Utils.getFileNameByPath(file?.path),
            type: 'image/jpeg'
        } as any);

        const config = {
            headers: {
                'Accept': 'multipart/form-data',
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (value: any) => {
                const percent: string = `${(value.loaded / value.total) * 100}`;
                ToastUtils.showMsgToast(`${lbMsg}... ${parseInt(percent, 10)}%`);
            }
        };
        const resUpload: any = await this.api().post(API_CONFIG.UPLOAD_MEDIA, form, config);
        if (resUpload?.success) {
            if (resUpload?.data) {
                return { success: true, data: resUpload.data };
            }

            ToastUtils.showErrorToast(Languages.image.uploadFailed);
            return { success: false, data: null };
        }
        ToastUtils.showErrorToast(Languages.image.uploadFailed);
        return { success: false, data: null };
    };

    uploadIdentify = async (avatar: string, front_facing_card: string, card_back: string) =>
        this.api().put(API_CONFIG.UPLOAD_IMAGE_IDENTIFY, {
            avatar,
            front_facing_card,
            card_back
        });

    uploadAvatar = async (photo: string) => this.api().post(API_CONFIG.UPLOAD_PERSONAL_PHOTO, {
        photo
    });
    
}

