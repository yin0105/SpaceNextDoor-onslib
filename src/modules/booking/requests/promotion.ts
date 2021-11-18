import { graphQuery } from '../../../graphql';
import { GET_PROMOTIONS } from '../graphql';
import { PromotionStatus, PromotionFormat } from '../../../graphql/enums';

export async function getPromotions(
  promotionId: number,
  voucherCode: string
): Promise<any[]> {
  const { data } = await graphQuery(GET_PROMOTIONS, {
    status: PromotionStatus.ACTIVE,
    start_date: new Date(),
    end_date: new Date(),
    format_public: PromotionFormat.PUBLIC,
    format_voucher: PromotionFormat.VOUCHER,
    id: promotionId,
    code: voucherCode,
  });

  return data.promotions;
}
