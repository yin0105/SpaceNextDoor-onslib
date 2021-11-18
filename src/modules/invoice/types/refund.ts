import { RefundType } from '../../../graphql';

type TRefundQueryResp = {
  id?: number;
  type?: RefundType;
  amount?: number;
};

type TRefundReceiptQueryResp = {
  id?: number;
  refunds: TRefundQueryResp[];
};

export type { TRefundReceiptQueryResp, TRefundQueryResp };
