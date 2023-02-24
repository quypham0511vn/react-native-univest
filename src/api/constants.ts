export const LIVE_MODE = true;

export enum API_CONFIG {
    // dev url
    //   BASE_URL = "https://api.univest.dev/app/v1",
    //   BASE_URL_NOTIFICATION = "https://noti-api.univest.dev",
    //   WEB_URL = "https://univest.dev",

    // live url
    BASE_URL = 'https://api.univest.vn/app/v1',
    WEB_URL = 'https://univest.vn',
    BASE_URL_NOTIFICATION = "https://noti-api.univest.vn/",

    DOMAIN_SHARE = "https://",

    IMAGES_HOST = "https://",

    GET_KEY_UPLOAD = "/api/KeyUpload",
    UPLOAD_IMAGE = "/UploadHandler.php",

    // common
    GET_VERSION = "/api/VersionApiStatic",
    ENCRYPT = "/api/Encrypt",

    // authentication
    LOGIN = "/user/login",
    TOKEN = "/token",
    REFRESH_TOKEN = "/token",
    LOGOUT = "/api/Logout",

    REGISTER = "/user/register", // đăng ký tài khoản (univest)
    OTP_ACTIVE = "/user/active", // nhận OTP (univest)
    SEND_OTP = "/user/send_otp", // Gui otp truoc khi thuc hien giao dich cũ
    SEND_PAYMENT_OTP = "/transaction/send_otp_payment", // Gui otp truoc khi thuc hien giao dich mới
    RESEND_PAYMENT_OTP = "/transaction/resend_otp_payment", // Gui lai otp truoc khi thuc hien giao dich mới
    GET_USER_INFO = "/user/show", // Thông tin account (univest)
    GET_CITY = "/address/city?id=1", // lấy thông tin các tỉnh thành
    GET_DiSTRICT = "/address/district", // lấy thông tin các quận huyện
    GET_WARD = "/address/ward", // lấy thông tin phường thị trấn
    UPDATE_INFO_USER = "/user/update_info", // cập nhật thông tin user
    CHANGE_PWD = "/user/change_password_v2", // thay đổi mật khẩu
    RESEND_OTP = "/user/resend_otp", // Gửi lại OTP
    RESEND_PWD = "user/resend_password", // Gửi SDT
    CONFIRM_OTP_FORGOT_PWD = "/user/confirm_otp_repassword", // Gửi lại OTP
    UPDATE_NEW_PWD = "/user/new_password_v2", // Change new password
    BLOCK_ACCOUNT = "/user/block_account", // Block account
    CONFIRM_BLOCK_ACCOUNT = "/user/confirm_block_account", // confirm block account

    UPDATE_REFERENCE = "/user/referent_code", // cập nhật người tư vấn,
    REFERENCE_INFO = "/user/referent_user", // thông tin tư vấn viên,
    REQUEST_SUPPORT = "/user/request-support", // yêu cầu tư vấn,
    RESPONSE_INVITE = "/referral/response-invite",

    // login with social media
    LOGIN_SOCIAL = "/user/login_social",
    CONFIRM_PHONE_NUMBER = "/user/phone_number_login_social",
    LINK_SOCIAL = "user/link_social", // Lien ket tai khoan mang xa hoi

    // common api
    GET_LIST_JOBS = "/configuration/job", // danh sach nghề nghiệp
    GET_GENDER = "/configuration/gender", // Lấy danh sách giới tính
    GET_PAYMENT_METHOD = "/configuration/source_recharge", // Lấy phương thức nạp/rút tiền

    // notify
    GET_LIST_NOTIFY = "/notification", // danh sách thông báo(univest)
    COUNT_NOTIFY = "/notification/count", // số lượng thông báo chưa đọc
    READ_NOTIFY = "/notification/seen", // set thông báo đã đọc
    GET_NOTIFY_DETAIL = "/notification", // chi tiết thông báo
    GET_NOTIFY_POPUP = "/notification/popup", // thông báo popup
    GET_CATEGORY = "/notification/category", // danh sách danh mục

    // notify - old
    GET_LIST_NOTIFY_OLD = '/notification/list', // danh sách thông báo(univest)
    COUNT_NOTIFY_OLD = '/notification/count', // số lượng thông báo chưa đọc
    READ_NOTIFY_OLD = '/notification/read', // set thông báo đã đọc

    // Bank
    GET_LIST_BANK = "/configuration/bank", // list bank
    UPDATE_LIST_BANK = "/user/taget_payment_bank", // Cập nhật tài khoản ngân hàng nhận tiền
    MONEY_METHOD = "/user/account_payment_user", // Danh sach hinh thuc rut tien của user

    // payment
    REQUEST_TOP_UP = "/transaction/create_recharge", // Tao giao dich nap tien

    WITHDRAW_TO_UNLIMITED_PERIOD = "/transaction/withdraw_money_to_wallet", // rút tiền về sổ ko kỳ hạn
    CALCULATE_WITHDRAW_TO_UNLIMITED_PERIOD = "/transaction/withdraw_show", // tính tiền về sổ ko kỳ hạn
    WITHDRAW_PAYMENT = "/transaction/transaction_payment", // Tạo giao dịch rút tiền về tài khoản
    REQUEST_WITHDRAW_OTP = "/transaction/send_otp_payment", // Request otp rút tiền
    SOURCE_PAYMENT = "/transaction/select_method_payment", // Chọn nguồn rút tiền

    // product
    GET_PRODUCT = "/product/sale_v2",
    GET_PRODUCT_V1 = "/product/sale",
    GET_PRODUCT_DETAILS = "/product/show",

    // transaction
    GET_TRANSACTION = "/transaction/list_transaction_user", // Lịch sử giao dịch
    TRANSACTION_DETAIL = "/transaction/show", // chi tiết giao dịch
    DELETE_TRANSACTIONS_PROCESSING = "/transaction/cancel_bill",

    // Assets
    GET_ASSETS_USER = "/asset/dashboard", // Tổng tài sản
    GET_LIST_ASSETS = "/asset/get_all", // Ds tất cả tài sản
    GET_DETAILS_ASSETS = "/asset/detail", // Chi tiết loại tài sản
    SHOW_ASSET = "/asset/show_contract", // Chi tiết gói tích luỹ
    ACCUMULATED_TRANSACTIONS = "/asset/transaction_contract", // Thông tin các giao dịch của sổ tích luỹ
    GET_TIMING_ASSETS = "/asset/list_transaction_contract", // Danh sách sổ tích luỹ theo kỳ hạn
    CONTRACT_INFO = "/asset/info_contract", // Chi tiết sổ tích luỹ có kỳ hạn
    UPDATE_INVEST_METHOD = "/asset/update_invest_method", // Cập nhật hình thức đầu tư cho sổ có kỳ hạn
    TRANSACTIONS_BY_PRODUCT = "/transaction/list_transaction_by_product", // Danh sách lịch sử giao dịch theo gói kỳ hạn
    ESTIMATE_INVEST = "/transaction/assumption_transaction", // Tính lãi trước khi đầu tư sổ có kỳ hạn
    INTEREST_HISTORY = "/transaction/list_transaction_receive_interest", // lịch sử nhận lãi túi univest
    PENDING_TRANSACTION = "/transaction/list_transaction_warning_to_account", // tiền đang chuyển
    TEMP_TRANSACTION = "/transaction/list_draft_transaction_user", // tiền đang chuyển
    CHECK_TRANSACTION = "/transaction/check_bill", // Check trạng thái tiền đang chuyển

    // upload image
    UPLOAD_MEDIA = "/upload",
    UPLOAD_IMAGE_IDENTIFY = "user/image_identity_user",
    UPLOAD_PERSONAL_PHOTO = "user/update_personal_photo",

    // send fcm token
    SEND_FCM_TOKEN = "/device/save",
    DELETE_TOKEN = "/device/clear", // Xóa token khi loguot

    // List banner
    GET_NEWS = "news/newspapers", // banner tin tuc
    GET_ABOUT_US = "news/about_us", // banner co gi de tin tuong univest,
    INTRODUCE = "news/cumulative_referrals", // giới thiệu sản phẩm,
    INTRODUCE_GROUP = "news/referrals_group_product", // giới thiệu nhóm sản phẩm,
    INTRODUCE_GENERAL = "news/referrals_general", // giới thiệu chung,
}

export enum LINK {
    FEEDBACK = "https://docs.google.com/forms/d/e/1FAIpQLScnC-kuJBzWFswh5iZ73Jq1kQ-mjrGSkHvJWV3vPbdoyjU3eQ/viewform",
    TICKET = "https://docs.google.com/forms/d/e/1FAIpQLSfDxMdDlRMY_Sy3L7GUG6J-aiqFjKszg8i7vhBVl-NT8EHrew/viewform",
    POLICY = "https://univest.vn/app-privacy-policy",
    ABOUT_US = "/category/ve-univest",
    USE_MANUAL = "/category/huong-dan-su-dung",
    TICH_LUY = "/category/tich-luy",
    QUESTIONS = "/questions",
    TUI_UNIVEST = "/category/tui-univest",
    CATEGORY = "/huong-dan-su-dung",
    INFO_INTEREST = "/info/interest/", // gioi thieu san pham
    INFO_PRODUCT = "/info/product/", // giới thiệu nhóm
    STORE_ANDROID = "https://play.google.com/store/apps/details?id=univest.vn",
    STORE_IOS = "https://apps.apple.com/vn/app/univest/id1613481261",
    DEFAULT_BANK_LOGO = "https://service.univest.vn/storage/uploads/MWVotaZ2DDfXZTClsnQiQJuwIGvCf4kuGmYNzFmH.png",
    DEFAULT_AVATAR = "https://devservice.univest.vn/storage/uploads/lKDd5JE5hhhtGL2gbWt28a5xb1WXLeTPcLYSRbsE.jpg",
    FAN_PAGE_IOS = "https://www.facebook.com/107827911893260",
    FAN_PAGE_ANDROID = "fb://page/107827911893260",
    ZALO = "https://zalo.me/3404590296885013337",
}

export const PAYMENT_URL = {
    NL_SUCCESSFULLY: `${API_CONFIG.BASE_URL}/transaction/success`,
    NL_FAILED: `${API_CONFIG.BASE_URL}/transaction/cancel`,
};
