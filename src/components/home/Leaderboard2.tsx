import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import { truncate } from "../../utils/history";
import { CircularProgress } from "@mui/material";
import useWindowSize from "../../hooks/useWindowSize";
import { Table } from "antd";
import Feed from "../Feed";

const MySlide = styled.div`
  // background-image: url('/img/angel.webp');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100%;
  width: 100%;
  filter: drop-shadow(1px 1px 8px rgba(0, 0, 0, 0.25));
`;

const Grider = styled.div`
  position: absolute;
  top: 0;
  width: 65%;
  height: 100%;
  z-index: -1;
  background-image: url("/img/grid.svg");
  opacity: 0.4;
`;


const columns = [
  {
    title: "Rank",
    dataIndex: "rank",
    key: "rank",
  },
  {
    title: "User",
    dataIndex: "user",
    key: "user",
  },
  {
    title: "Total",
    dataIndex: "total",
    key: "total",
    render: (text: any, record: any) => (
      <div className="flex flex-row gap-1 items-center justify-center">
        <p className="w-full text-[12px]">{record.total.toFixed(2)}</p>
        <img src="/img/sol.svg" alt="solana logo" className="w-[7px]" />
      </div>
    ),
  },
];

export const Leaderboard2 = () => {
  const { data: leaderboard, isLoading } = useQuery<
    { user: string; total: number }[]
  >({
    queryKey: ["leaderboard"],
  });

  const { width } = useWindowSize();
  const rowsToShow = width >= 1024 ? 3 : width >= 768 ? 2 : 1;
  const itemsToShow = rowsToShow * 3;

  const tableData =
    leaderboard &&
    leaderboard.slice(0, itemsToShow).map((item, i) => ({
      key: i,
      rank:
        i === 0 ? (
          <img src="/img/crown.png" alt="First Place" className="crown-logo" />
        ) : (
          i + 1
        ),
      user: truncate(item.user, 4, 4),
      total: item.total,
    }));

  return (
    <section className="my-20 relative">
      <Grider className="-z-10" />
      <h2 className="py-2 px-4 pt-4 font-bold text-xl text-start mb-2">
        Top Re<span className="text-renaissance-orange">:</span>demptions{" "}
        <span className="text-[8px] text-gray-400">(7D)</span>
      </h2>
      <MySlide>
        <div className="flex flex-row items-center justify-around h-full w-full">
          {isLoading ? (
            <CircularProgress />
          ) : (
            <div className="flex flex-col md:flex-row items-center justify-between h-full w-full my-5 relative gap-10">
              <Table
                dataSource={tableData}
                columns={columns}
                pagination={false}
                showHeader={false}
                className="w-full md:w-1/3 rounded-md dark-mode-table"
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <img
                  src="/renaissance-logo.svg"
                  alt="renaissance"
                  className={`w-20 h-20`}
                />
              </div>
              <div className="w-full md:w-1/2 flex flex-col gap-10 items-start md:items-end justify-center px-4 md:px-0">
                <h3>
                  Live Re<span className="text-renaissance-orange">:</span>
                  demptions
                </h3>
                <Feed />
                <div className="feed-blur -z-10 -right-[800px]"></div>
              </div>
            </div>
          )}
        </div>
      </MySlide>
    </section>
  );
};
