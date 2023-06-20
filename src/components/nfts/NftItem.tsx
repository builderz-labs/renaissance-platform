import styled from "styled-components";
import VerifiedIcon from "@mui/icons-material/Verified";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import WarningIcon from "@mui/icons-material/Warning";
import DiamondIcon from "@mui/icons-material/Diamond";
import AssistantPhotoIcon from "@mui/icons-material/AssistantPhoto";
import { Checkbox, Tooltip } from "@mui/material";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

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

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export const NftItem = ({ nft, selectedItems, setSelectedItems, fee }: any) => {
  const handleCheck = (nft: any) => {
    if (
      nft.renaissance?.royaltiesPaid ||
      nft.renaissance?.status === "error" ||
      nft.compression.compressed
    ) {
      return;
    }

    if (selectedItems.includes(nft)) {
      setSelectedItems(selectedItems.filter((item: any) => item !== nft));
    } else {
      setSelectedItems([...selectedItems, nft]);
    }
  };

  const isSelected = selectedItems.includes(nft);
  const isUnpaid =
    !nft.renaissance?.royaltiesPaid && nft.renaissance?.status !== "error";

  return (
    <ItemCard
      onClick={() => handleCheck(nft)}
      key={nft.id}
      className=" rounded-lg relative pb-4"
    >
      {/* If never sold, display icon */}
      {/* other statuses: paid-with-tool, partial, paid-at-sale, error */}
      {nft.compression.compressed && (
        <div className="absolute top-[165px] right-0 bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          {/* TODO: add icon */}
          <Tooltip placement="top-end" title="Compressed NFT">
            <WarningIcon className="text-blue-500" />
          </Tooltip>
        </div>
      )}
      {nft.renaissance?.status === "error" && (
        <div className="absolute top-[165px] right-0 bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          <Tooltip placement="top-end" title="Error">
            <WarningIcon className="text-red-500" />
          </Tooltip>
        </div>
      )}
      {nft.renaissance?.status === "never-sold" && (
        <div className="absolute top-[165px] pt-1 right-0 bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          <Tooltip placement="top-end" title="Diamond Hand - Never Sold">
            <DiamondIcon className="text-orange-500" />
          </Tooltip>
        </div>
      )}
      {nft.renaissance?.status === "paid-with-tool" && (
        <div className="absolute top-[165px] right-0 bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          <Tooltip placement="top-end" title="Paid with Tool">
            <VerifiedUserIcon className="text-purple-500" />
          </Tooltip>
        </div>
      )}
      {nft.renaissance?.status === "partial" && (
        <div className="absolute top-[165px] right-0 bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          <Tooltip placement="top-end" title="Partially Paid">
            <AssistantPhotoIcon className="text-orange-500" />
          </Tooltip>
        </div>
      )}
      {nft.renaissance?.status === "paid-at-sale" && (
        <div className="absolute top-[165px] right-0 bg-opacity-60 rounded-full  w-8 h-8 flex items-center justify-center ">
          <Tooltip title="Paid at Sale" placement="top">
            <VerifiedIcon className="text-orange-500" />
          </Tooltip>
        </div>
      )}
      <div
        className={`w-70 h-70 object-cover rounded-lg ${
          nft.renaissance?.royaltiesPaid ? " " : "border-[#FF5557]"
        } `}
      >
        {!nft.renaissance?.royaltiesPaid &&
          nft.status !== "error" &&
          !nft.compression.compressed && (
            <div className="absolute top-2 right-2 rounded-md ">
              <Checkbox
                {...label}
                checked={isSelected}
                readOnly
                sx={{
                  color: "#ffaa85",
                  "&.Mui-checked": {
                    color: "#FF8A57",
                  },
                }}
              />
            </div>
          )}
        <img
          src={nft.content.files[0]?.uri}
          width={150}
          height={150}
          alt="NFT"
          className={`p-2 w-full h-40 object-cover rounded-lg  ${
            nft.renaissance?.royaltiesPaid || nft.compression.compressed
              ? ""
              : " border-2 border-opacity-40  border-[#FF5557]"
          } ${isSelected ? "border-opacity-100" : "border-opacity-40"}}`}
        />
      </div>
      <p className="font-medium my-2 px-2  text-start w-32 text-lg truncate hover:text-[#FF8A57]">
        {nft.content.metadata.name}
      </p>
      {isUnpaid && !nft.compression.compressed && (
        <p className="text-red-500 text-start text-[10px] ml-2">
          Outstanding:{" "}
          {(
            (nft.renaissance?.royaltiesToPay +
              (nft.renaissance?.royaltiesToPay * fee || 0)) /
            LAMPORTS_PER_SOL
          ).toFixed(2)}{" "}
          SOL
        </p>
      )}
    </ItemCard>
  );
};
