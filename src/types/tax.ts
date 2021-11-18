enum TaxType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

type TTax = {
  type: TaxType;
  value: number;
};

export { TaxType };
export type { TTax };
