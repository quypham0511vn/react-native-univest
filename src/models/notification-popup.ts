export interface ExtraData {
    type: string
    text: string
    value: string
}
export interface NotificationPopupModel {
    created_at: number
    updated_at: number
    id: number
    user_id: number
    category_id: number
    template_id: number
    title: string
    description: string
    body: string
    link: string
    link_title: string
    popup_image: string
    body_image: string
    extra: ExtraData[] | undefined
    last_seen: number
}
