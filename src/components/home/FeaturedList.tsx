import { useQuery } from '@tanstack/react-query';
import { Collection } from '../../data/types';
import { useNavigate } from 'react-router-dom';
import useWindowSize from '../../hooks/useWindowSize';
import styled from 'styled-components';

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

export const FeaturedList = () => {
  const navigate = useNavigate();
  const { width } = useWindowSize();

  const itemsToShow = width >= 1024 ? 6 : width >= 768 ? 4 : 2;

  const { data } = useQuery<Collection[]>({
    queryKey: ['collections'],
  });

  return (
    <section className="my-10">
      <h2 className="py-2 px-2 pt-4 font-bold text-xl text-start">
        Top Re<span className='text-orange-500'>:</span>deemed Collections
      </h2>
      <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 px-2 gap-4">
        {data &&
          data.slice(0, itemsToShow).map((collection) => (
            <div
              key={collection.id}
              onClick={() => navigate(`/project/${collection.name}`)}
              className="hover:text-renaissance-orange "
            >
              <div
                key={collection.id}
                className="w-full relative flex flex-col items-center justify-center my-2"
              >
                <div className="w-full h-full object-cover">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="h-28 w-full object-cover rounded-md"
                  />
                </div>
                <div className="py-2 absolute bottom-2 left-0 w-full  bg-black bg-opacity-60 blur font-black"></div>
                <ItemCard className="h-[100px] w-full">
                  <p className="py-4 left-0 w-full  font-black">
                    {collection.name}
                  </p>
                  <div className='w-full flex items-center justify-center'>
                    <p className="  font-light text-[12px]">
                      {/* @ts-ignore */}
                      {/* FP: {marketplaceData?.data[0]?.floorPriceLamports ? (parseFloat(marketplaceData?.data[0]?.floorPriceLamports!) / LAMPORTS_PER_SOL).toFixed(2) : "0.00"} */}
                    </p>
                    <img
                      src="/img/sol.svg"
                      alt="solana logo"
                      className="w-[12px]"
                    />
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
