export type TGeneratedCurrency = {
  id?: number;
  code?: string;
  sign?: string;
};

export type TGeneratedFeature = {
  id?: number;
  name_en?: string;
};

export type TGeneratedUnitTypeFeature = {
  feature?: TGeneratedFeature;
};

export type TGeneratedUnitType = {
  id?: number;
  name_en?: string;
  name_th?: string;
  unit_type_features?: TGeneratedUnitTypeFeature[];
};

export type TGeneratedUnitSubType = {
  id?: number;
  height?: number;
  width?: number;
  length?: number;
  measurement_unit?: string;
  price_per_month?: number;
  currency?: TGeneratedCurrency;
  unit_type?: TGeneratedUnitType;
};
