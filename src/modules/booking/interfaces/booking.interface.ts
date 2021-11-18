import {
  BookingStatus,
  PromotionBuyTypes,
  PromotionFormat,
  PromotionStatus,
  RenewalStatus,
} from '../../../graphql/enums';

export interface ICurrency {
  id: number;
  sign: string;
  code: string;
}

export interface IBooking {
  id: number;
  created_at: Date;
  move_in_date: Date;
  move_out_date: Date;
  status: BookingStatus;
  base_amount: number;
  deposit_amount: number;
  customer_id: number;
  customer_email: string;
  currency: ICurrency;
}

export interface IBookingPromotion {
  id: number;
  format: PromotionFormat;
  status: PromotionStatus;
  bookings_promotions_customer_buys: ICustomerBuys[];
}

export interface ICalculateTerminationDuesResp {
  move_out_date: Date;
  termination_date: Date;
  failed_renewals_amount: number;
  remaining_days_amount: number;
  notice_period_amount: number;
  promotion_amount: number;
  total_amount: number;
  currency: string;
  currency_sign: string;
}

export interface ICustomerBuys {
  id: number;
  type: PromotionBuyTypes;
  value: number;
}

export interface IRenewal {
  id: number;
  status: RenewalStatus;
  discount_amount: number;
  renewal_start_date: Date;
  renewal_end_date: Date;
  total_amount: number;
}
