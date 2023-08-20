import { useQuery } from "@tanstack/react-query";
import { Collection } from "../../data/types";
import { useNavigate } from "react-router-dom";
import useWindowSize from "../../hooks/useWindowSize";
import styled from "styled-components";

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
`;
const ItemCard2 = styled.div`
  background: linear-gradient(206.07deg, #050505 30.45%, #101c26 99.29%);
  border: 0.5px solid;
  border-radius: 10px;
  border-image-source: linear-gradient(
    0deg,
    #e6813e 0%,
    rgba(255, 138, 87, 0) 17.53%,
    rgba(255, 138, 87, 0.17) 52.43%,
    rgba(255, 138, 87, 0) 81.08%,
    #e6813e 100%
  );
  border-image-slice: 1;
  border-image-width: 1;
`;

export const FeaturedList = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();

  const itemsToShow = width >= 1024 ? 6 : width >= 768 ? 4 : 2;

  const { data } = useQuery<Collection[]>({
    queryKey: ["collectionsV1"],
  });

  // to do sort for top redeemed collections


  return (
    <section className="my-10">
      <h2 className="py-2 px-2 pt-4 font-bold text-xl text-start">
        Top Re<span className="text-orange-500">:</span>deemed Collections
      </h2>
      <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 px-2 gap-4 md:gap-8 mt-5">
        {data &&
          data.slice(0, itemsToShow).map((collection, index) => (
            <div
              key={collection.id}
              onClick={() => navigate(`/project/${collection.name}`)}
              className="hover:text-renaissance-orange cursor-pointer "
            >
              <div
                key={collection.id}
                className="w-full relative flex flex-col items-center justify-center my-2"
              >
                <div className="w-full h-full object-cover">

                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-32 md:h-32 w-full object-contain rounded-full relative z-10 p-4"
                  />

                </div>
                <div className="py-2 absolute bottom-2 left-0 w-full  bg-black bg-opacity-60 blur font-black"></div>

                <ItemCard className="h-auto -mt-10 relative z-0 w-full py-10 pb-5 rounded-lg backdrop-blur-xl">
                  <p className="py-4 left-0 w-full  font-black">
                    {collection.name}
                  </p>
                  <div className="flex flex-row items-center justify-around">
                    <div className=" flex items-center justify-center ">
                      <p className="  font-light text-[12px]">
                        {/* FP: {marketplaceData?.data[0]?.floorPriceLamports ? (parseFloat(marketplaceData?.data[0]?.floorPriceLamports!) / LAMPORTS_PER_SOL).toFixed(2) : "0.00"} */}
                      </p>
                      {/* <img
                          src="/img/sol.svg"
                          alt="solana logo"
                          className="w-[12px] topcollectionimage"
                        /> */}
                    </div>
                    {/* <p className="text-xs">7.2%</p> */}
                  </div>
                </ItemCard>

              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default FeaturedList;
