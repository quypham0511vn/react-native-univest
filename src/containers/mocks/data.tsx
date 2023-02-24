import React from 'react';

import DrawIcon from '@/assets/images/ic_draw.svg';
import InvestIcon from '@/assets/images/ic_invest.svg';
import ProductIcon from '@/assets/images/ic_product.svg';
import AccountIcon from '@/assets/images/ic_account.svg';
import UnlimitedIcon from '@/assets/images/ic_unlimited.svg';
import FirstIcon from '@/assets/images/ic_first.svg';
import ThirdIcon from '@/assets/images/ic_third.svg';
import SixthIcon from '@/assets/images/ic_sixth.svg';
import Languages from '@/commons/Languages';
import ScreenNames from '@/commons/ScreenNames';
import { AccumulationModel } from '@/models/accumulation';

const imgPath = require('@/assets/images/ic_back.png');
const imgBannerPath = require('@/assets/images/ic_back.png');

export const INTRO_DATA = [
    {
        id: 1,
        path: imgPath
    },
    {
        id: 2,
        path: imgPath
    },
    {
        id: 3,
        path: imgPath
    }
];
export const TRUST_DATA = [
    {
        id: 1,
        path: imgBannerPath
    },
    {
        id: 2,
        path: imgBannerPath
    },
    {
        id: 3,
        path: imgBannerPath
    }
];
export const UTILITIES = [
    {
        id: 1,
        icon: <InvestIcon />,
        title: Languages.product.investor,
        screen: ScreenNames.account
    },
    {
        id: 2,
        icon: <DrawIcon />,
        title: Languages.product.drawMoney,
        screen: ScreenNames.account
    },
    {
        id: 3,
        icon: <ProductIcon />,
        title: Languages.product.product,
        screen: ScreenNames.account
    },
    {
        id: 4,
        icon: <AccountIcon />,
        title: Languages.product.account,
        screen: ScreenNames.account
    }
];
export const PRODUCT_DATA = [
    {
        icon: <UnlimitedIcon />,
        title: Languages.product.unlimitedAccumulation,
        content1: 'Tính lãi theo ngày, nhận lãi hàng tháng',
        content2: 'Rút gốc bất kì khi nào',
        percent: '4'
    },
    {
        icon: <FirstIcon />,
        title: Languages.product.accumulation1,
        content1: 'Nhận lại cuối kì',
        content2: 'Rút tiền miễn phí, rút tiền trước hạn không ',
        percent: '5'
    },
    {
        icon: <ThirdIcon />,
        title: Languages.product.accumulation3,
        content1: 'Nhận lại cuối kì',
        content2: 'Rút tiền miễn phí',
        percent: '6'
    },
    {
        icon: <SixthIcon />,
        title: Languages.product.accumulation6,
        content1: 'Nhận lại cuối kì',
        content2: 'Rút tiền miễn phí, rút tiền trước hạn không ',
        percent: '6'
    }
];
export const CONVERT_DATA = [
    {
        value: 'Tích luỹ Không thời hạn',
        text: 'XXX.XXX.XXX',
        id: '1'
    },
    {
        value: 'Tích luỹ kỳ hạn 1 tháng',
        text: 'XXX.XXX.XXX',
        id: '2'
    },
    {
        value: 'Tích luỹ kỳ hạn 3 tháng',
        text: 'XXX.XXX.XXX',
        id: '3'
    },
    {
        value: 'Tích luỹ kỳ hạn 6 tháng',
        text: 'XXX.XXX.XXX',
        id: '4'
    }
];
export const KEYBOOK_DATA = [
    {
        value: 'STK2020516172',
        text: 'XXX.XXX.XXX',
        id: '1'
    },
    {
        value: 'STK2020516172',
        text: 'XXX.XXX.XXX',
        id: '2'
    },
    {
        value: 'STK2020516172',
        text: 'XXX.XXX.XXX',
        id: '3'
    },
    {
        value: 'STK2020516172',
        text: 'XXX.XXX.XXX',
        id: '4'
    }
];
export const CONTRACT_DATA = [
    {
        id: 1,
        title: 'Lorem Ipsum is simply dummy text of the print'
    },
    {
        id: 2,
        title: 'Lorem Ipsum is simply dummy text of the print'
    },
    {
        id: 3,
        title: 'Lorem Ipsum is simply dummy text of the print'
    }
];

export const ACCUMULATIONS: AccumulationModel[] = [
    {
        title: 'Không kỳ hạn',
        rate: '15',
        period: 0,
        id: 0
    },
    {
        title: 'Kỳ hạn 2 tháng',
        rate: '15',
        period: 2,
        id: 1
    },
    {
        title: 'Kỳ hạn 6 tháng',
        rate: '15',
        period: 6,
        id: 2
    },
    {
        title: 'Kỳ hạn 1 tháng',
        rate: '15',
        period: 1,
        id: 3
    },
    {
        title: 'Kỳ hạn 2 tháng',
        rate: '15',
        period: 2,
        id: 4
    },
    {
        title: 'Kỳ hạn 3 tháng',
        rate: '15',
        period: 3,
        id: 5
    }
];

export const HISTORIES = [
    {
        title: 'Đáo hạn kỳ 1',
        date: '12/11/2021',
        id: 0
    },
    {
        title: 'Đáo hạn kỳ 1',
        date: '12/11/2021',
        id: 1
    },
    {
        title: 'Đáo hạn kỳ 1',
        date: '12/11/2021',
        id: 2
    },
    {
        title: 'Đáo hạn kỳ 1',
        date: '12/11/2021',
        id: 3
    },
    {
        title: 'Đáo hạn kỳ 1',
        date: '12/11/2021',
        id: 4
    },
    {
        title: 'Đáo hạn kỳ 1',
        date: '12/11/2021',
        id: 5
    }
];
export const NEWS = [
    {
        title: 'Địa chỉ văn phòng của Univest',
        id: 0
    },
    {
        title: 'Làm sao để nạp tiền vào Univest?',
        id: 1
    },
    {
        title: 'Các gói tích luỹ của Univest được tính lãu suất như thế nào?',
        id: 2
    },
    {
        title: 'Các gói tích luỹ của Univest được tính lãu suất như thế nào?',
        id: 3
    },
    {
        title: 'Các gói tích luỹ của Univest được tính lãu suất như thế nào?',
        id: 4
    },
    {
        title: 'Các gói tích luỹ của Univest được tính lãu suất như thế nào?',
        id: 5
    }
];

export const TRANSACTIONS = [
    {
        id: 0,
        title: 'Tất toán sổ tiết kiệm',
        data: {
            'Mã sổ tiết kiệm': 'STK202054874',
            'Kỳ hạn tích luỹ': '6 tháng',
            'Số tiền tất toán': '14.000.000',
            'Ngày giao dịch': '01/01/2020',
            'Số tiền gốc': '12.000.000',
            'Lãi tích luỹ': '2.000.000',
            'Lãi xuất áp dụng': '6% /  năm',
            'Ngày bắt đầu': '01/01/2020',
            'Ngày kết thúc': '01/06/2020'
        }
    },
    {
        id: 1,
        title: 'Nạp tiền vào tích luỹ',
        data: {
            'Số tài khoản': '12346578921',
            'Số tiền tất toán': '14.000.000',
            'Ngày giao dịch': '01/01/2020'
        }
    }
];
export const ListNotify = [
    {
        id: 0,
        title: 'Phê duyệt thành công!',
        desCripTion: 'Hợp đồng 000621 đã được hội sở phê duyệt thành công.',
        dateCreatAt: '2021/05/17 11:41:39',
        image: '',
        unread: '1'
    },
    {
        id: 1,
        title: 'Thanh toán bảo hiểm thành công!',
        desCripTion:
      'Bảo hiểm VBI - Sốt xuất huyết cá nhân gói vàng đã được thanh toán 450.000đ thành công.',
        dateCreatAt: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    },
    {
        id: 2,
        title: 'Hóa đơn điện đã quá 7 ngày chưa thanh toán?',
        desCripTion:
      'Đã quá 7 ngày bạn chưa thanh toán hóa đơn Điện lực miền Bắc, số hợp đồng PA00CPCP000111, số tiền: 100.000đ.',
        dateCreatAt: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    },
    {
        id: 3,
        title: 'Phê duyệt thành công!',
        desCripTion: 'Hợp đồng 000621 đã được hội sở phê duyệt thành công.',
        dateCreatAt: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    },
    {
        id: 4,
        title: 'Thanh toán bảo hiểm thành công!',
        desCripTion:
      'Bảo hiểm VBI - Sốt xuất huyết cá nhân gói vàng đã được thanh toán 450.000đ thành công.',
        dateCreatAt: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    },
    {
        id: 5,
        title: 'Thanh toán bảo hiểm thành công!',
        desCripTion:
      'Bảo hiểm VBI - Sốt xuất huyết cá nhân gói vàng đã được thanh toán 450.000đ thành công.',
        dateCreatAt: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    },
    {
        id: 6,
        title: 'Thanh toán bảo hiểm thành công!',
        desCripTion:
      'Bảo hiểm VBI - Sốt xuất huyết cá nhân gói vàng đã được thanh toán 450.000đ thành công.',
        dateCreatAt: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    },
    {
        id: 7,
        title: 'Thanh toán bảo hiểm thành công!',
        desCripTion:
      'Bảo hiểm VBI - Sốt xuất huyết cá nhân gói vàng đã được thanh toán 450.000đ thành công.',
        dateCreatAt: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    }
];
export const ListAccumulator = [
    {
        id: 1,
        key: 'STL2017605161',
        value: 12000000
    },
    {
        id: 2,
        key: 'STL2017605161',
        value: 12000000
    },
    {
        id: 3,
        key: 'STL2017605161',
        value: 12000000
    },
    {
        id: 4,
        key: 'STL2017605161',
        value: 12000000
    }
];
