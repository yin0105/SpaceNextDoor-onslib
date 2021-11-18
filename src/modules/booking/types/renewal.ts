import { RenewalStatus, RenewalType } from '../../../graphql/enums';
import { TBookingQueryResp } from './booking';

export type TCreateBookingRenewalResp = {
  id: number;
  base_amount: number;
  deposit_amount: number;
  insurance_amount: number;
  discount_amount: number;
  sub_total_amount: number;
  admin_fee_amount: number;
  has_admin_fee: boolean;
  has_custom_price: boolean;
  total_amount: number;
  admin_fee_tax: number;
  total_rent_tax_amount: number;
  total_insurance_tax_amount: number;
  prepaid_months?: number;
  renewal_start_date?: Date;
  renewal_end_date?: Date;
};

export type TRenewalPayload = {
  deposit_amount: number;
  status: RenewalStatus;
  type: RenewalType;
  base_amount: number;
  transaction_id?: number | null;
  total_amount: number;
  sub_total_amount: number;
  discount_amount: number;
  renewal_start_date: Date;
  renewal_end_date: Date;
  next_renewal_date: Date;
  insurance_id?: number | null;
  insurance_amount: number;
  admin_fee_amount?: number;
  admin_fee_tax?: number;
  has_admin_fee?: boolean;
  has_custom_price?: boolean;
  promotion_id?: number;
  booking_promotion_id?: number;
};

export type TRenewalQueryResp = {
  id: number;
  booking: TBookingQueryResp;
  base_amount: number;
  insurance_amount: number;
  deposit_amount: number;
  discount_amount: number;
  sub_total_amount: number;
  admin_fee_amount: number;
  admin_fee_tax: number;
  total_rent_tax_amount: number;
  total_insurance_tax_amount: number;
  total_amount: number;
  renewal_start_date: Date;
  renewal_end_date: Date;
};
