import { DataNode } from 'antd/lib/tree';
import {
  Applicable,
  DisplayType,
  PaymentType,
  PERMISSIONS,
  StatusKyc,
  TypeTemplateNoti,
} from '../enum';

interface IObjectProperty {
  name: string;
  value: string | boolean | number | null;
}
export const STATUS_ACTIVE: IObjectProperty[] = [
  { name: 'general_status_active', value: '' },
  { name: 'general_active', value: 'ACTIVE' },
  { name: 'general_inactive', value: 'INACTIVE' },
];

export const RESPONSE_TYPE = {
  SUCCESS: 'SUCCESS',
};

export const OPTION_STATUS_ACTIVE: IObjectProperty[] = [
  { name: 'general_active', value: 'true' },
  { name: 'general_inactive', value: 'false' },
];

export const OPTION_GENDER: IObjectProperty[] = [
  { name: 'general_gender_male', value: 'MALE' },
  { name: 'general_gender_female', value: 'FEMALE' },
];

export const STATUS_ACCOUNT: IObjectProperty[] = [
  { name: 'general_status_account', value: '' },
  { name: 'general_waiting_verify', value: '1' },
  { name: 'general_success_verify', value: '2' },
  { name: 'general_denied_verify', value: '3' },
];

export const STATUS_KYC: IObjectProperty[] = [
  { name: 'general_verified_kyc', value: StatusKyc.ACCEPT },
  { name: 'general_kyc_not_verified', value: StatusKyc.NOT_REQUEST },
  { name: 'general_cancel_kyc', value: StatusKyc.REFUSE },
  { name: 'general_pending_kyc', value: StatusKyc.PENDING },
];

export const KYC_TYPE: IObjectProperty[] = [
  { name: 'general_kyc_type_IDcard', value: 'IDENTIFY_CARD' },
  { name: 'general_kyc_type_passport', value: 'PASSPORT' },
  { name: 'general_kyc_type_driving_license', value: 'DRIVING_LICENSE' },
];

export const PAYMENT_TYPE: IObjectProperty[] = [
  { name: 'general_payment_vtc', value: PaymentType.VTC_PAY },
  { name: 'general_payment_domestic_bank', value: PaymentType.DOMESTIC_BANK },
  {
    name: 'general_payment_international_card',
    value: PaymentType.INTERNATIONAL_CARD,
  },
];

export const KYC_PHOTO_TYPES: IObjectProperty[] = [
  { name: 'general_kyc_photo_type_front', value: 'FRONT_PHOTO' },
  { name: 'general_kyc_photo_type_back', value: 'BACK_PHOTO' },
];

export const APPLICABLE: IObjectProperty[] = [
  { name: 'general_all', value: Applicable.ALL },
  { name: 'general_user', value: Applicable.USER },
];

export const DISPLAY_TYPE: IObjectProperty[] = [
  { name: 'general_on', value: DisplayType.ON },
  { name: 'general_off', value: DisplayType.OFF },
];
export const TYPE_TEMPLATE_NOTI: IObjectProperty[] = [
  { name: 'general_noti_topic', value: TypeTemplateNoti.TOPIC },
  { name: 'general_noti_user', value: TypeTemplateNoti.USER },
];

export const ENVIRONMENTS = {
  API_URL: process.env.APP__API_URL,
  LOCAL_STORAGE_KEY: process.env.APP__LOCAL_STORAGE_KEY,
  DEFAULT_API_MAP: 'AIzaSyDoK1hLMa-TyEE-1_rSiT7XC7bED3kUzoM',
};
export const ROLE_TYPE = {
  ADMIN_MANAGEMENT_LEVEL: 'admin_management_level',
  ROLE_GROUP_LEVEL: 'role_group_level',
  USER_MANAGEMENT_LEVEL: 'user_management_level',
  KYC_MANAGEMENT_LEVEL: 'kyc_management_level',
  GIFT_MANAGEMENT_LEVEL: 'gift_management_level',
  GIFT_RECIVE_MANAGEMENT_LEVEL: 'gift_recive_management_level',
  ITEM_MANAGEMENT_LEVEL: 'item_management_level',
  REPORT_MANAGEMENT_LEVEL: 'report_management_level',
  SYSTEM_SETTING_LEVEL: 'system_setting_level',
};

export const TREE_DATA_ROLE: DataNode[] = [
  {
    title: 'Quản lý tài khoản admin',
    key: ROLE_TYPE.ADMIN_MANAGEMENT_LEVEL,
    children: [
      {
        title: 'Xem',
        key: ROLE_TYPE.ADMIN_MANAGEMENT_LEVEL + '_' + PERMISSIONS.READ,
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: ROLE_TYPE.ADMIN_MANAGEMENT_LEVEL + '_' + PERMISSIONS.FULL,
      },
    ],
  },
  {
    title: 'Quản lý nhóm phân quyền',
    key: ROLE_TYPE.ROLE_GROUP_LEVEL,
    children: [
      {
        title: 'Xem',
        key: ROLE_TYPE.ROLE_GROUP_LEVEL + '_' + PERMISSIONS.READ,
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: ROLE_TYPE.ROLE_GROUP_LEVEL + '_' + PERMISSIONS.FULL,
      },
    ],
  },
  {
    title: 'Quản lý tài khoản người dùng',
    key: ROLE_TYPE.USER_MANAGEMENT_LEVEL,
    children: [
      {
        title: 'Xem',
        key: ROLE_TYPE.USER_MANAGEMENT_LEVEL + '_' + PERMISSIONS.READ,
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: ROLE_TYPE.USER_MANAGEMENT_LEVEL + '_' + PERMISSIONS.FULL,
      },
    ],
  },
  {
    title: 'Quản lý yêu cầu xác thực',
    key: ROLE_TYPE.KYC_MANAGEMENT_LEVEL,
    children: [
      {
        title: 'Xem',
        key: ROLE_TYPE.KYC_MANAGEMENT_LEVEL + '_' + PERMISSIONS.READ,
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: ROLE_TYPE.KYC_MANAGEMENT_LEVEL + '_' + PERMISSIONS.FULL,
      },
    ],
  },
  {
    title: 'Quản lý quà tặng',
    key: ROLE_TYPE.GIFT_MANAGEMENT_LEVEL,
    children: [
      {
        title: 'Xem',
        key: ROLE_TYPE.GIFT_MANAGEMENT_LEVEL + '_' + PERMISSIONS.READ,
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: ROLE_TYPE.GIFT_MANAGEMENT_LEVEL + '_' + PERMISSIONS.FULL,
      },
    ],
  },
  {
    title: 'Quản vật phẩm',
    key: ROLE_TYPE.ITEM_MANAGEMENT_LEVEL,
    children: [
      {
        title: 'Xem',
        key: ROLE_TYPE.ITEM_MANAGEMENT_LEVEL + '_' + PERMISSIONS.READ,
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: ROLE_TYPE.ITEM_MANAGEMENT_LEVEL + '_' + PERMISSIONS.FULL,
      },
    ],
  },
  {
    title: 'Danh sách nhận quà',
    key: ROLE_TYPE.GIFT_RECIVE_MANAGEMENT_LEVEL,
    children: [
      {
        title: 'Xem',
        key: ROLE_TYPE.GIFT_RECIVE_MANAGEMENT_LEVEL + '_' + PERMISSIONS.READ,
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: ROLE_TYPE.GIFT_RECIVE_MANAGEMENT_LEVEL + '_' + PERMISSIONS.FULL,
      },
    ],
  },
  {
    title: 'Báo cáo thống kê',
    key: ROLE_TYPE.REPORT_MANAGEMENT_LEVEL,
    children: [
      {
        title: 'Xem',
        key: ROLE_TYPE.REPORT_MANAGEMENT_LEVEL + '_' + PERMISSIONS.READ,
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: ROLE_TYPE.REPORT_MANAGEMENT_LEVEL + '_' + PERMISSIONS.FULL,
      },
    ],
  },
  {
    title: 'Cài đặt hệ thống',
    key: ROLE_TYPE.SYSTEM_SETTING_LEVEL,
    children: [
      {
        title: 'Xem',
        key: ROLE_TYPE.SYSTEM_SETTING_LEVEL + '_' + PERMISSIONS.READ,
      },
      {
        title: 'Thêm mới,sửa,xoá',
        key: ROLE_TYPE.SYSTEM_SETTING_LEVEL + '_' + PERMISSIONS.FULL,
      },
    ],
  },
];
