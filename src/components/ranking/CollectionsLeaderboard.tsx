import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Collection } from "../../data/types";
import RankingTable from './RankingTable';
// import { getCollectionLeaderboard } from "../../utils/history";

export const CollectionsLeaderboard = () => {
  const { data: collections, isLoading: isLoadingCollections } = useQuery<Collection[]>({
    queryKey: ["collections"],
  });

  // const { data: collectionsLeaderboard, isLoading: isLoadingLeaderboard } = useQuery({
  //   queryKey: ["collectionsLeaderboard"],
  //   queryFn: () => {} // getCollectionLeaderboard(collections!.map(col => col.collectionAddress)),
  //   // enabled: !!collections,
  // });

  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-between justify-center gap-4  py-5 mb-40 rounded-lg px-4">
      <h2 className="text-2xl font-semibold text-start my-2 mb-4">
        Top Collections:
      </h2>
      {isLoadingCollections ? (
        <CircularProgress />
      ) : (
        <>
          <div className="border-b border-gray-200 bg-gray-900  px-4 py-5 sm:px-6 text-start">
            <h3 className="text-base font-semibold leading-6 text-gray-100">Pos.</h3>
          </div>
          <div className="flex flex-col gap-4 md:gap-8 rounded-md">
            {collections &&
              collections.map((item, index) => (
                <div
                  onClick={() => navigate(`/project/${item.name}`)}
                  key={item.id}
                  className="hover:text-renaissance-orange hover:scale-105 transition-all duration-300 ease-in-out"
                >
                  <div className="grid grid-cols-8 gap-4 items-center justify-center w-full px-4 py-2 rounded-md border-b border-b-white border-opacity-10 ">
                    <div className="w-[20px] col-span-1">
                      <p className="font-bold">{item.id}.</p>
                    </div>
                    <div className="flex flex-row gap-4 col-span-5 w-full text-start items-center justify-start">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-5 h-5 rounded-full"
                      />
                      <p className="w-full  font-bold text-[18px]">{item.name}</p>
                    </div>
                    {/* <div className="flex flex-row gap-2 col-span-2 items-center justify-end">
                    <p className=" font-bold text-[18px]">{item.sol}</p>
                    <img src="/img/sol.svg" alt="solana logo" className="w-4" />
                  </div> */}
                  </div>
                </div>
              ))}
          </div>
          <RankingTable />
        </>
      )}
    </div>
  );
};
