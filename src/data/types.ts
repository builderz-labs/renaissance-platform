import { DAS } from "helius-sdk";

export type Collection = {
  id: number;
  name: string;
  description: string;
  image: string;
  collectionAddresses: string[];
  helloMoonCollectionId: string;
  socials: {
    name: string;
    url: string;
  }[];
  fee: number;
};

export interface CheckedNft {
  mint: string;
  royaltiesPaid: boolean;
  royaltiesPaidAmount: number;
  royaltiesToPay: number;
  status: string;
  redemptionTimestamp: number;
}

export interface NftData extends DAS.GetAssetResponse {
  renaissance: CheckedNft | undefined;
}
