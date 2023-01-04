export enum StatusKyc {
  NOT_REQUEST = 'NOT_REQUEST',
  PENDING = 'PENDING',
  ACCEPT = 'ACCEPT',
  REFUSE = 'REFUSE',
}
export enum ROLE {
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum StatusAccount {
  ACTIVE = 'true',
  INACTIVE = 'false',
}
export enum Applicable {
  ALL = 'ALL',
  USER = 'USER',
}
export enum DisplayType {
  ON = 'ON',
  OFF = 'OFF',
}

export enum PaymentType {
  VTC_PAY = 'VTCPay',
  DOMESTIC_BANK = 'DomesticBank',
  INTERNATIONAL_CARD = 'InternationalCard',
}

export enum KycType {
  IDENTIFY_CARD = 'IDENTIFY_CARD',
  PASSPORT = 'PASSPORT',
  DRIVING_LICENSE = 'DRIVING_LICENSE',
}

export enum KycPhotoType {
  FRONT_PHOTO = 'FRONT_PHOTO',
  BACK_PHOTO = 'BACK_PHOTO',
}
export enum MerchantType {
  APP = 'APP',
  WEBSITE = 'WEBSITE',
}
export enum TypeTemplateNoti {
  USER = 'USER',
  TOPIC = 'TOPIC',
}

//locamos

export enum PERMISSIONS {
  NONE = 'NONE',
  READ = 'READ',
  FULL = 'FULL',
}
