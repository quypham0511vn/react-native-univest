import { Id } from './id';

export interface BaseModel {
    _id: Id;
    id: number;
    name: string;
    image?: any;
}
export interface BaseModelData {
    id: number;
    title: string;
    month: {
        id: number;
        name: string;
        status: string;
        timeCreate: string;
        price: string;
        image_avatar?: string;
        check_status: string;
        color: string;
    }[];
}
export interface BaseModelDataNotify {
    id: number;
    title: string;
    desCripTion: string,
    dateCreatAt: string,
    image: string,
    unread: string
}

