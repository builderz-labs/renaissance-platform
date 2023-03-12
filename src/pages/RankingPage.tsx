import styled from 'styled-components';
import { leaderBoard } from '../data/leaderBoard';
import { allCollections } from '../data/allCollections';

const MySlide = styled.div`
  background-image: url('/img/ren.png');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
height: 180px;
width: 100%;
filter: drop-shadow(1px 1px 8px rgba(0, 0, 0, 0.25));
margin-x: 18px;
padding-y: 18px;
  `
const Blur1 = styled.div`
background: linear-gradient(180deg, #E6813E 0%, #00B2FF 100%);
filter: blur(50.5px);
width: 260px;
height: 260px;
`

export default function RankingPage() {

    const itemsToMap = leaderBoard.slice(3);


    return (
        <main className='mt-5 mb-40 relative'>
            <Blur1 className='absolute -top-40 -right-40 z-0 opacity-20' />
            <Blur1 className='absolute top-20 right-40 z-0 opacity-10' />
            <h2 className='text-2xl font-semibold text-start mb-4' >Top Redeemer:</h2>
            <MySlide className='py-4'>
                <div className="flex flex-col items-center justify-center h-full w-full my-4">

                    <div className="grid grid-cols-8 gap-4 items-center justify-center w-full px-4 py-2 rounded-md">
                        <div className="w-[20px] h-4 col-span-1">
                            <img src="/img/crown.png" alt="First Place" />
                        </div>
                        <div className="flex flex-row gap-4 col-span-5 w-full text-start items-center justify-start">
                            <p className='text-[18px]  col-span-5  font-black'>{leaderBoard[0].name}</p>
                        </div>
                        <div className="flex flex-row gap-2 col-span-2 items-center justify-start">
                            <p className='font-bold text-[18px]'>{leaderBoard[0].sol}</p>
                            <img src="/img/sol.svg" alt="solana logo" className='w-[7px]' />
                        </div>
                    </div>
                    <Blur1 className='absolute top-60 -right-60 z-0 opacity-20' />
                    {leaderBoard.slice(1, 3).map((item) => (
                        <div className="grid grid-cols-8 gap-4 items-center justify-center w-full px-4 py-2 rounded-md">
                            <div className="w-4 col-span-1 h-4">
                                <p>{item.rank}.</p>
                            </div>
                            <p className='truncate col-span-5 text-start items-center justify-start'>{item.name}</p>
                            <div className="flex flex-row gap-2 col-span-2 items-center justify-start">
                                <p className='font-bold text-[18px]'>{leaderBoard[0].sol}</p>
                                <img src="/img/sol.svg" alt="solana logo" className='w-[7px]' />
                            </div>
                        </div>
                    ))}

                </div>
            </MySlide>
            <div className="flex flex-col items-between justify-center gap-4  py-5 mb-40">
                <h2 className='text-2xl font-semibold text-start my-2 mb-4'>Top Collections:</h2>
                <div className="bg-lily-black bg-opacity-40 flex flex-col gap-4 py-5">
                    {allCollections.map((item, index) => (
                        <a href={`/project/${item.name}`} key={item.id} className='hover:text-renaissance-orange'>
                            <div className="grid grid-cols-8 gap-4 items-center justify-center w-full px-4 py-2 rounded-md border-b border-b-white ">
                                <div className="w-[20px] col-span-1">
                                    <p>{item.id}.</p>
                                </div>
                                <div className="flex flex-row gap-4 col-span-5 w-full text-start items-center justify-start">
                                    <img src={item.image} alt={item.name} className='w-5 h-5 rounded-full' />
                                    <p className='w-full  font-bold text-[18px]'>{item.name}</p>
                                </div>
                                <div className="flex flex-row gap-2 col-span-2 items-center justify-start">
                                    <p className=' font-bold text-[18px]'>{item.sol}</p>
                                    <img src="/img/sol.svg" alt="solana logo" className='w-4' />
                                </div>
                            </div>
                        </a>

                    ))}
                </div>
            </div>

        </main>
    );
}
