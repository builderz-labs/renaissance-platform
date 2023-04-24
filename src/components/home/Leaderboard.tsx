import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { truncate } from '../../utils/history';
import { CircularProgress } from '@mui/material';
import useWindowSize from '../../hooks/useWindowSize';

const MySlide = styled.div`
  background-image: url('/img/ren.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 320px;
  width: 100%;
  filter: drop-shadow(1px 1px 8px rgba(0, 0, 0, 0.25));
`;


export const Leaderboard = () => {
  const { data: leaderboard, isLoading } = useQuery<
    { user: string; total: number }[]
  >({
    queryKey: ['leaderboard'],
  });

  const { width } = useWindowSize();
  const rowsToShow = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  const itemsToShow = rowsToShow * 3;

  return (
    <section className="">
      <h2 className="py-2 px-4 pt-4 font-bold text-xl text-start mb-2">
        Top Re<span className="text-renaissance-orange">:</span>demptions{' '}
        <span className="text-[8px] text-gray-400">(7D)</span>
      </h2>
      <MySlide>
        <div className="flex flex-col items-center justify-center h-full w-full px-16">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {leaderboard &&
                leaderboard.slice(0, itemsToShow).map((item, i) => (
                  <div
                    key={i}
                    className={`flex flex-row items-center justify-between bg-black bg-opacity-20 rounded-lg p-2 w-full ${i === 0 ? 'font-bold text-xl' : 'font-light text-sm'
                      }`}
                  >
                    <div className="w-4 h-4">
                      {i === 0 ? (
                        <img src="/img/crown.png" alt="First Place" />
                      ) : (
                        <p>{i + 1}.</p>
                      )}
                    </div>
                    <p>{truncate(item.user, 4, 4)}</p>
                    <div className="flex flex-row gap-1 items-center justify-center">
                      <p className="w-full text-[12px]">
                        {item.total.toFixed(2)}
                      </p>
                      <img
                        src="/img/sol.svg"
                        alt="solana logo"
                        className="w-[7px]"
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </MySlide>
    </section>
  );
};

