import styled from "styled-components";
import { useQuery, QueryClient } from "@tanstack/react-query";
import { truncate } from "../utils/history";
import { defer, useLoaderData, Await } from "react-router-dom";
import { fetchLeaderboard } from "../utils/history";
import { Suspense } from "react";
import { Loading } from "../components/Loading";
import { Leaderboard } from "../components/home/Leaderboard";
import { CollectionsLeaderboard } from "../components/ranking/CollectionsLeaderboard";
import { getAllCollection } from "../utils/collections";

const Blur1 = styled.div`
  background: linear-gradient(180deg, #e6813e 0%, #00b2ff 100%);
  filter: blur(50.5px);
  width: 260px;
  height: 260px;
`;

export const loader = (queryClient: QueryClient) => {
  return defer({
    collectionsV1: queryClient.fetchQuery({
      queryKey: ["collectionsV1"],
      queryFn: () => getAllCollection(),
    }),
    leaderboard: queryClient.fetchQuery({
      queryKey: ["leaderboard"],
      queryFn: () => fetchLeaderboard(),
    }),
  });
};

export const RankingPage = () => {
  const { collections } = useLoaderData() as any;

  return (
    <main className="mt-5 mb-40 relative">
      {/* <Blur1 className="absolute -top-40 -right-40 z-0 opacity-20" /> */}
      {/* <Blur1 className="absolute top-20 right-40 z-0 opacity-10" /> */}
      <Suspense fallback={<Loading />}>
        <Await resolve={collections}>
          <Leaderboard />
          <CollectionsLeaderboard />
        </Await>
      </Suspense>
    </main>
  );
};
