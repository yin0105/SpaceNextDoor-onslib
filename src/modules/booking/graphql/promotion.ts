export const GET_PROMOTIONS = `
  query getPromotions($end_date: timestamptz, $id: Int, $format_public: enum_promotions_format, $code: String, $format_voucher: enum_promotions_format, $status: enum_promotions_status, $start_date: timestamptz) {
    promotions(where: {_or: {end_date: {_eq: null, _gte: $end_date}, _or: [{id: {_eq: $id}, format: {_eq: $format_public}}, {code: {_eq: $code}, format: {_eq: $format_voucher}}]}, status: {_eq: $status}, start_date: {_lte: $start_date}}) {
      id
      name_th
      name_en
      max_per_day
      max_per_customer
      max
      format
      end_date
      description_th
      description_en
      code
      status
      promotions_customer_buys {
        type
        value
        building_id
      }
      promotions_customer_gets {
        for_type
        for_value
        max_amount_per_booking
        value
        type
      }
      promotions_redeems {
        booking_id
        customer_id
        promotion_id
        renewal_id
        id
        updated_at
        created_at
        booking_promotion_id
      }
    }
  }
`;
