import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { Collection } from "../../data/types";
import { CollectionStatsRequest } from "@hellomoon/api";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { client } from "../../utils/hellomoon";

const ItemCard = styled.div`
  background: linear-gradient(206.07deg, #050505 30.45%, #101c26 99.29%);
  border: 1px solid;
  border-image-source: linear-gradient(
    119.5deg,
    rgba(255, 138, 87, 0) 25.6%,
    rgba(255, 138, 87, 0) 78.09%,
    #e6813e 90.35%
  );
  border-image-slice: 1;
  border-image-width: 1;
  border-radius: 12px;
`;

export const AllCollectionsItem = ({
  collection,
  viewMode,
}: {
  collection: Collection;
  viewMode: string;
}) => {
  const navigate = useNavigate();

  const { data: collectionStats } = useQuery({
    queryKey: ["collectionStats", collection.helloMoonCollectionId],
    queryFn: () =>
      client.send(
        new CollectionStatsRequest({
          helloMoonCollectionId: collection.helloMoonCollectionId,
          limit: 1,
        })
      ),
  });

  console.log(collectionStats);

  return (
    <div
      key={collection.id}
      onClick={() => navigate(`/project/${collection.name}`)}
      className="w-full cursor-pointer"
    >
      <ItemCard
        className={
          viewMode === "grid"
            ? "w-full relative flex flex-row items-center justify-between my-2 hover:scale-105 transition-all duration-300 ease-in-out"
            : "w-full relative flex flex-row items-between justify-between my-2 hover:scale-105 transition-all duration-300 ease-in-out hover:text-orange-500 hover:font-bold"
        }
      >
        <div className="w-[69px] h-full object-cover">
          <img
            src={collection.image}
            alt={collection.name}
            className="h-[69px] w-full object-cover rounded-md"
          />
        </div>
        <div
          className={
            viewMode === "grid"
              ? "flex flex-col gap-2 justify-center items-start text-start flex-grow pl-4"
              : "flex flex-row gap-2 justify-between items-center text-start flex-grow pl-4 pr-4"
          }
        >
          <p
            className={
              viewMode === "grid"
                ? "w-full  font-black truncate max-w-[70px] text-sm"
                : "  font-black text-sm"
            }
          >
            {collection.name}
          </p>
          <div
            className={
              viewMode === "grid"
                ? "flex flex-row gap-1 items-center justify-center"
                : "flex flex-row  items-center justify-center gap-10"
            }
          >
            <p
              className={
                viewMode === "grid"
                  ? "w-full  font-light text-[12px]"
                  : "w-full  font-light text-[18px]"
              }
            >
              FP:{" "}
              {collectionStats?.data[0]?.floorPriceLamports
                ? (
                    parseFloat(collectionStats?.data[0]?.floorPriceLamports) /
                    LAMPORTS_PER_SOL
                  ).toFixed(2)
                : "0.00"}
            </p>
            <img
              src="/img/sol.svg"
              alt="solana logo"
              className={
                viewMode === "grid" ? "w-[12px] h-[12px]" : "w-[18px] h-[18px]"
              }
            />
          </div>
        </div>
      </ItemCard>
    </div>
  );
};
