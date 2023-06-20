import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { NftItem } from "../nfts/NftItem";
import { Loading } from "../Loading";
import { repayRoyalties } from "../../utils/repayRoyalties";
import { useConnection } from "@solana/wallet-adapter-react";
import { toast } from "react-toastify";
import { Collection } from "../../data/types";
import useNfts from "../../hooks/useNfts";

export const NftListRedemption = ({
  pageCollection,
}: {
  pageCollection?: Collection;
}) => {
  // Solana
  const wallet = useWallet();
  const { connection } = useConnection();

  const nfts = useNfts();

  // Filtered NFT states
  const [filteredNfts, setFilteredNfts] = useState<any[]>([]);
  const [currentNfts, setCurrentNfts] = useState<any[]>([]);

  // Populate state as soon as checkedNfts is available
  useEffect(() => {
    if (nfts.nfts) {
      setCurrentNfts(nfts.nfts.slice(startIndex, endIndex));
      setFilteredNfts(nfts.nfts);
    }
  }, [nfts.nfts]);

  // Pagination
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10; // number of items to display per page

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  useEffect(() => {
    if (filteredNfts) {
      const pageCount = Math.ceil(filteredNfts.length / pageSize);
      setPageCount(pageCount);
    }
  }, [filteredNfts]);

  const handlePageChange = (newPage: { selected: number }) => {
    setCurrentPage(newPage.selected + 1);
  };

  // State for repayment
  const [loading, setLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const [totalToRepay, setTotalToRepay] = useState(0);

  // Display filters
  const [showUnpaidRoyaltiesOnly, setShowUnpaidRoyaltiesOnly] = useState(false);
  const [selectAllUnpaid, setSelectAllUnpaid] = useState(false);

  // Show unpaid only
  useEffect(() => {
    if (nfts.nfts) {
      let filteredNfts: any[] = nfts.nfts;
      if (showUnpaidRoyaltiesOnly) {
        filteredNfts = nfts.nfts!.filter(
          (nft) => !nft.royaltiesPaid && nft.status !== "error"
        );
      }
      setCurrentNfts(filteredNfts.slice(startIndex, endIndex));
      setFilteredNfts(filteredNfts);
    }
  }, [endIndex, startIndex, showUnpaidRoyaltiesOnly]);

  // Set Total to Repay
  useEffect(() => {
    const total = selectedItems.reduce((acc: any, item: any) => {
      return acc + item.royaltiesToPay;
    }, 0);
    setTotalToRepay(total / LAMPORTS_PER_SOL);
  }, [selectedItems]);

  //  Select All Unpaid
  useEffect(() => {
    if (selectAllUnpaid) {
      const filteredNfts = nfts.nfts!.filter(
        (nft) => !nft.royaltiesPaid && nft.status !== "error"
      );
      setSelectedItems(filteredNfts);
    } else if (!selectAllUnpaid) {
      setSelectedItems([]);
    }
  }, [selectAllUnpaid]);

  // Repay Royalties
  const handleRepay = async () => {
    setLoading(true);

    const fee = pageCollection?.fee || 0.2;

    let itemsToRepay = [...selectedItems];
    if (selectAllUnpaid) {
      itemsToRepay = nfts.nfts!.filter((nft) => nft.royaltiesToPay > 0);
    }
    try {
      const res = await repayRoyalties(itemsToRepay, connection, wallet, fee);
      if (res) {
        nfts.refetchNfts();
        toast.success("Royalties Repaid");
      } else {
        toast.error("Error Repaying Royalties");
      }
      setSelectedItems([]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setSelectedItems([]);
      setLoading(false);
    }
  };

  // While loading return Loader
  if (nfts.loading) {
    return <Loading />;
  }

  // If no NFTs of collection return message
  if (nfts.nfts && nfts.nfts.length === 0) {
    return (
      <div>
        <h2 className="text-xs">You do not own any NFTs of this collection</h2>
      </div>
    );
  }

  // const [searchQuery, setSearchQuery] = useState("");

  // useEffect(() => {
  //   if (nfts.nfts) {
  //     let filteredNfts = nfts.nfts;
  //     if (searchQuery) {
  //       filteredNfts = nfts.nfts.filter((nft) =>
  //         nft.name.toLowerCase().includes(searchQuery.toLowerCase())
  //       );
  //     }
  //     setFilteredNfts(filteredNfts);
  //     setCurrentNfts(filteredNfts.slice(startIndex, endIndex));
  //   }
  // }, [nfts.nfts, searchQuery, startIndex, endIndex]);

  return (
    <section className="mt-10">
      <div className="w-full flex flex-row items-center justify-between gap-8 mb-5">
        <input
          type="text"
          placeholder="Search NFTs"
          className="w-1/2 border border-gray-800 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-900"
          // value={searchQuery}
          // onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="flex w-full items-center justify-end gap-4">
          <div className="flex items-center justify-end gap-2 text-xs  ">
            <input
              type="checkbox"
              checked={selectAllUnpaid}
              onChange={() => setSelectAllUnpaid(!selectAllUnpaid)}
            />
            <label>Select All Unpaid</label>
          </div>
          <div className="flex items-center justify-end gap-2 text-xs ">
            <div className="flex items-center justify-end gap-2 text-xs ">
              <input
                type="checkbox"
                checked={showUnpaidRoyaltiesOnly}
                onChange={() =>
                  setShowUnpaidRoyaltiesOnly(!showUnpaidRoyaltiesOnly)
                }
              />
              <label>Show Unpaid Royalties Only</label>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 ">
        {currentNfts?.map((nft: any) => {
          return (
            <NftItem
              key={nft.id}
              nft={nft}
              selectedItems={selectedItems}
              setSelectedItems={(items: any) => setSelectedItems(items)}
              fee={pageCollection?.fee || 0.2}
            />
          );
        })}
      </div>
      <div>
        {nfts.nfts && nfts.nfts.length > pageSize && (
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageChange}
            containerClassName="pagination"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-previous-item"
            nextClassName="page-next-item"
            previousLinkClassName="page-link"
            nextLinkClassName="page-link"
            activeClassName="active"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            pageRangeDisplayed={3}
            pageCount={pageCount}
            previousLabel="<"
          />
        )}
        <div className="my-5  flex flex-col   items-end  justify-end  w-full gap-8">
          <div className="flex flex-row gap-4 items-center justify-end w-full my-10  ">
            {selectedItems.length > 0 && (
              <p className=" text-xs">
                {selectedItems.length} NFT{selectedItems.length > 1 && "s"}{" "}
                selected
              </p>
            )}
            <button
              onClick={handleRepay}
              disabled={selectedItems.length === 0}
              className={
                "btn btn-buy text-black  pt-0 pb-0 px-[36px] rounded-[120px] bg-[#ff8a57] border-2 border-gray-900 disabled:bg-[#3f3f3f]  disabled:cursor-not-allowed disabled:text-gray-100 hover:bg-[#ffd19d]  " +
                (loading && " loading")
              }
            >
              Redeem{" "}
              {(
                totalToRepay +
                totalToRepay * (pageCollection?.fee || 0.2)
              ).toFixed(2)}{" "}
              SOL
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
