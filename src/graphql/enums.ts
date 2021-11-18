/** ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

export enum LoginTokenType {
  BEARER = 'BEARER',
}

export enum BookingStatus {
  RESERVED = 'RESERVED',
  CONFIRMED = 'CONFIRMED',
  ACTIVE = 'ACTIVE',
  TERMINATED = 'TERMINATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum PromotionForType {
  FIRST_MONTHS = 'FIRST_MONTHS',
  LAST_MONTHS = 'LAST_MONTHS',
  RENEWAL_INDEX = 'RENEWAL_INDEX',
}

export enum RenewalStatus {
  PAID = 'PAID',
  UN_PAID = 'UN_PAID',
  FAILED = 'FAILED',
}

export enum RenewalType {
  BOOKING = 'BOOKING',
  FULL_SUBSCRIPTION = 'FULL_SUBSCRIPTION',
  PARTIAL_SUBSCRIPTION = 'PARTIAL_SUBSCRIPTION',
}

export enum TransactionType {
  BOOKING = 'BOOKING',
  BOOKING_RENT = 'BOOKING_RENT',
  BOOKING_RENT_INSURANCE = 'BOOKING_RENT_INSURANCE',
  BOOKING_DEPOSIT = 'BOOKING_DEPOSIT',
  TERMINATION = 'TERMINATION',
  REFUND_DEPOSIT = 'REFUND_DEPOSIT',
  REFUND_INSURANCE = 'REFUND_INSURANCE',
  REFUND_RENT = 'REFUND_RENT',
  REFUND_ADMIN_FEE = 'REFUND_ADMIN_FEE',
  INVOICE_RECEIPT = 'INVOICE_RECEIPT',
  REFUND_RECEIPT = 'REFUND_RECEIPT',
}

export enum FixedCountry {
  Singapore = 'Singapore',
  Thailand = 'Thailand',
  Japan = 'Japan',
  Korea = 'Korea',
}

export enum VehicleType {
  VAN = 'VAN',
  LORRY10 = 'LORRY10',
  LORRY14 = 'LORRY14',
  LORRY24 = 'LORRY24',
}

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum PayoutStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

export enum PlatformFeatureType {
  SITE = 'SITE',
  SPACE = 'SPACE',
}

export enum PolicyType {
  CANCELLATION = 'CANCELLATION',
  RENEWAL = 'RENEWAL',
}

export enum ServiceType {
  PICK_UP = 'PICK_UP',
}

export enum ServiceFrequency {
  RECURRING = 'RECURRING',
  ONE_TIME = 'ONE_TIME',
}

export enum SpaceCategoryItemSizeUnit {
  cm = 'cm',
}

export enum SpaceSizeUnit {
  sqft = 'sqft',
  sqm = 'sqm',
}

export enum PromotionBuyTypes {
  MIN_DAYS = 'MIN_DAYS',
  MIN_PRICE = 'MIN_PRICE',
}

export enum PromotionType {
  TOTAL_AMOUNT = 'TOTAL_AMOUNT',
  PERCENTAGE_DISCOUNT = 'PERCENTAGE_DISCOUNT',
  FIXED_AMOUNT_DISCOUNT = 'FIXED_AMOUNT_DISCOUNT',
}

export enum PromotionFormat {
  PUBLIC = 'PUBLIC',
  VOUCHER = 'VOUCHER',
  CODE = 'CODE',
}

export enum PromotionStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  FINISH = 'FINISH',
  IN_ACTIVE = 'IN_ACTIVE',
}

export enum SortBy {
  asc = 'asc',
  desc = 'desc',
}

export enum ProviderType {
  BUSINESS = 'BUSINESS',
  INDIVIDUAL = 'INDIVIDUAL',
}

export enum SiteStatus {
  DRAFT = 'DRAFT',
  REJECTED = 'REJECTED',
  READY_TO_REVIEW = 'READY_TO_REVIEW',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum PriceType {
  BASE_PRICE = 'BASE_PRICE',
  DISCOUNTED_PRICE = 'DISCOUNTED_PRICE',
}

export enum SpaceStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
  ARCHIVED = 'ARCHIVED',
  REJECTED = 'REJECTED',
  READY_TO_REVIEW = 'READY_TO_REVIEW',
  DRAFT = 'DRAFT',
}

export enum StockManagementType {
  THIRD_PARTY = 'THIRD_PARTY',
  SND = 'SND',
}

export enum TerminationStatus {
  REQUESTED = 'REQUESTED',
  ON_HOLD = 'ON_HOLD',
  SCHEDULED = 'SCHEDULED',
  TERMINATED = 'TERMINATED',
}

export enum TerminationPaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
}

export enum TerminationPayloadStatus {
  REQUESTED = 'REQUESTED',
  ON_HOLD = 'ON_HOLD',
  TERMINATED = 'TERMINATED',
  PAID = 'PAID',
}

export enum UploadType {
  BUILDINGS = 'BUILDINGS',
  CUSTOMERS = 'CUSTOMERS',
  FEATURES = 'FEATURES',
  INSURANCES = 'INSURANCES',
  INVOICES = 'INVOICES',
  POLICIES = 'POLICIES',
  PROMOTIONS = 'PROMOTIONS',
  USERS = 'USERS',
  CONTRACTS = 'CONTRACTS',
}

export enum RefundType {
  DEPOSIT = 'DEPOSIT',
  INSURANCE = 'INSURANCE',
  RENT = 'RENT',
  ADMIN_FEE = 'ADMIN_FEE',
}

export enum RefundMethod {
  APPLIED_REFUND = 'APPLIED_REFUND',
}

export enum RefundReceiptStatus {
  PAID = 'PAID',
  SCHEDULED = 'SCHEDULED',
  VOID = 'VOID',
}

export enum AvailableStatus {
  VACANT = 'VACANT',
  OCCUPIED = 'OCCUPIED',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  RESERVED = 'RESERVED',
}

export enum InvoiceStatus {
  INVOICED = 'INVOICED',
  VOIDED = 'VOICED',
  PAID = 'PAID',
  PARTIAL_PAID = 'PARTIAL_PAID',
}

export enum InvoiceFeeType {
  RENT = 'RENT',
  INSURANCE = 'INSURANCE',
  DEPOSIT = 'DEPOSIT',
  ADMIN_FEE = 'ADMIN_FEE',
}

export enum TransactionStatus {
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  PENDING = 'PENDING',
}

export enum InvoiceReceiptStatus {
  VOIDED = 'VOIDED',
  PAID = 'PAID',
}

export enum InvoiceWaivingFeeStatus {
  WAIVED = 'WAIVED',
  UNWAIVED = 'UNWAIVED',
}
