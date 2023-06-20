import { Collection } from "../../data/types";
import styled from "styled-components";
import { useState, useEffect, useCallback } from "react";
import { SmallLoading } from "../../components/SmallLoading";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { useWallet } from "@solana/wallet-adapter-react";
import { getCheckedNftsForCollection } from "../../utils/nfts";
import { useConnection } from "@solana/wallet-adapter-react";
import { repayRoyalties } from "../../utils/repayRoyalties";
import { toast } from "react-toastify";
import { Tooltip } from "@mui/material";

const ItemCard = styled.div`
  background: linear-gradient(206.07deg, #050505 30.45%, #101c26 99.29%);
  border-radius: 12px;
  border: 0.5px solid;
  border-image-source: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 138, 87, 0.1) 100%
  );
`;

export const NftStats = ({
  pageCollection,
}: {
  pageCollection?: Collection;
}) => {
  const wallet = useWallet();
  const { connection } = useConnection();

  const fetchNfts = useCallback(async () => {
    if (pageCollection) {
      return getCheckedNftsForCollection(wallet.publicKey!, [
        ...pageCollection.collectionAddresses!,
      ]);
    } else {
      return getCheckedNftsForCollection(wallet.publicKey!);
    }
  }, [wallet.publicKey, pageCollection]);

  const {
    data: checkedNfts,
    isLoading,
    refetch,
  } = useQuery<any[]>(
    ["checkedNfts", pageCollection?.collectionAddresses, wallet.publicKey],
    fetchNfts,
    {
      enabled: !!wallet.publicKey,
    }
  );

  // States
  const [loading, setLoading] = useState(false);
  const [outstandingRoyalties, setOutstandingRoyalties] = useState(0);
  const [nftsPaid, setNftsPaid] = useState(0);
  const [royaltiesPaid, setRoyaltiesPaid] = useState(0);

  useEffect(() => {
    if (checkedNfts) {
      const normalNfts = checkedNfts.filter(
        (nft) => !nft.compression.compressed
      );
      const outstandingRoyalties = normalNfts.reduce(
        (acc: number, nft: any) => acc + nft.renaissance?.royaltiesToPay,
        0
      );

      const nftsPaid = normalNfts.filter(
        (nft: any) => nft.renaissance?.royaltiesPaid
      ).length;

      const royaltiesPaid = normalNfts.reduce(
        (acc: number, nft: any) => acc + nft.renaissance?.royaltiesPaidAmount,
        0
      );

      setOutstandingRoyalties(outstandingRoyalties);
      setNftsPaid(nftsPaid);
      setRoyaltiesPaid(royaltiesPaid);
    }
  }, [checkedNfts]);

  // Repay Royalties
  const handleRepay = async () => {
    setLoading(true);

    const fee = pageCollection?.fee || 0.2;

    const itemsToRepay = checkedNfts!.filter(
      (nft) => nft.renaissance?.royaltiesToPay > 0
    );

    try {
      const res = await repayRoyalties(itemsToRepay, connection, wallet, fee);
      if (res) {
        await refetch();
        toast.success("Royalties Repaid");
      } else {
        toast.error("Error Repaying Royalties");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center my-5 rounded-lg shadow-lg">
      <ItemCard className="w-full">
        <div className="w-full flex justify-end">
          <div className="w-1/2 h-full p-5 flex flex-col items-center justify-center gap-1">
            <p className="text-[12px]">Outstanding Royalties:</p>

            <ItemCard className="h-full w-full mx-4 flex items-center justify-center">
              <div className="flex flex-row gap-2 my-2 items-center justify-center w-full h-full">
                <div className="flex flex-col gap-2 items-center justify-center py-2">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div className="w-full text-center font-bold text-sm">
                      {isLoading === true ? (
                        <SmallLoading />
                      ) : (
                        <p className="font-light text-xs">
                          {(
                            (outstandingRoyalties +
                              outstandingRoyalties *
                                (pageCollection?.fee || 0.2)) /
                            LAMPORTS_PER_SOL
                          ).toFixed(2)}
                        </p>
                      )}
                    </div>
                    {!isLoading && (
                      <img
                        src="/img/sol.svg"
                        alt="solana logo"
                        className="w-4 h-4"
                      />
                    )}
                  </div>
                </div>
              </div>
            </ItemCard>
          </div>
          <div className="w-1/2 h-full p-5 flex flex-col items-start justify-start gap-1">
            <div className="flex flex-row gap-2 items-center justify-between w-full">
              <div className="">
                <Tooltip
                  title="Actual royalties rate received. total_royalties / total_sales"
                  placement="top"
                  className="cursor-help"
                >
                  <p className="text-start  font-light text-xs">Redeemed:</p>
                </Tooltip>
              </div>

              <div className="flex flex-row gap-2 items-center justify-center pr-2">
                <div className="w-full font-light text-xs">
                  {isLoading ? (
                    <SmallLoading />
                  ) : (
                    <p className="font-light text-xs">
                      {nftsPaid} of {checkedNfts?.length}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="border-b border-b-gray-500 w-full my-2"></div>

            <div className="flex flex-row gap-2 items-center justify-between w-full">
              <div className="">
                <Tooltip
                  title="Creators' royalty rate as per on-chain metadata"
                  placement="top"
                  className="cursor-help"
                >
                  <p className="text-start  font-light text-[12px]">
                    Total Paid:
                  </p>
                </Tooltip>
              </div>{" "}
              <div className="flex flex-row gap-2 items-center justify-center pr-2">
                <div className="w-full  font-light text-xs">
                  {isLoading ? (
                    <SmallLoading />
                  ) : (
                    <p className="font-light text-xs">
                      {(royaltiesPaid / LAMPORTS_PER_SOL).toFixed(2)}
                    </p>
                  )}
                </div>
                {!isLoading && (
                  <img
                    src="/img/sol.svg"
                    alt="solana logo"
                    className="w-4 h-4"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {outstandingRoyalties > 0 && checkedNfts && (
          <div className="flex flex-row items-center justify-between mb-5">
            <div className="w-full flex items-start justify-end mx-4">
              <button
                disabled={outstandingRoyalties === 0}
                onClick={handleRepay}
                className={
                  "btn  text-black  pt-0 pb-0 w-full  rounded-[120px] bg-[#ff8a57] border-2 border-gray-900 disabled:bg-[#3f3f3f]  disabled:cursor-not-allowed disabled:text-gray-100 hover:bg-[#ffd19d] break-keep" +
                  (loading && " loading")
                }
              >
                Redeem All
              </button>
            </div>
          </div>
        )}
      </ItemCard>
    </div>
  );
};
