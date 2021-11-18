export type TTaxApplied = {
  building_tax_id?: number;
  insurance_tax_id?: number;
  name_en: string;
  name_th: string;
  currency_id: number;
  type: TaxType;
  value: number;
  tax_amount: number;
  booking_id: number;
  renewal_id: number;
};

export enum TaxType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export type TTax = {
  type: TaxType;
  value: number;
};
