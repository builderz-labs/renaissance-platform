import styled from "styled-components";
import { QueryClient } from "@tanstack/react-query";
import FeaturedList from "../components/home/FeaturedList";
import { Suspense } from "react";
import { AllCollections } from "../components/home/AllCollections";
import { Await, defer, useLoaderData } from "react-router-dom";
import { Loading } from "../components/Loading";
import { Leaderboard } from "../components/home/Leaderboard";
import { fetchLeaderboard } from "../utils/history";
import FormBanner from "../components/FormBanner/FormBanner";
import HeaderBanner from "../components/HeaderBanner";
import { getAllCollection } from "../utils/collections";
import { Leaderboard2 } from "../components/home/Leaderboard2";

const Blur1 = styled.div`
  background: linear-gradient(180deg, #e6813e 0%, #00b2ff 100%);
  filter: blur(50.5px);
  width: 260px;
  height: 260px;
`;

export const loader = (queryClient: QueryClient) => {
  return defer({
    // collections: queryClient.fetchQuery({
    //   queryKey: ["collections"],
    //   queryFn: () => fetch("/collections.json").then((res) => res.json()), // /src/data/collections.json
    //   staleTime: 1000 * 60 * 2,
    // }),
    leaderboard: queryClient.fetchQuery({
      queryKey: ["leaderboard"],
      queryFn: () => fetchLeaderboard(),
    }),
    collectionsV1: queryClient.fetchQuery({
      queryKey: ["collectionsV1"],
      queryFn: () => getAllCollection(),
    }),
  });
};

export const HomePage = () => {
  const { collectionsV1 } = useLoaderData() as any;

  return (
    <main className="h-full max-w-full relative">
      {/* <Blur1 className="absolute -top-40 -right-40 z-0 opacity-20" /> */}
      {/* <Blur1 className="absolute top-40 right-40 -z-10 opacity-20" /> */}
      <Suspense fallback={<Loading />}>
        <Await resolve={collectionsV1}>
          {/* All Sections in their own components */}
          <HeaderBanner />
          <section className="mt-5">
            <FeaturedList />
          </section>
          <section className="">
            <Leaderboard2 />
          </section>

          {/* <Blur1 className="absolute top-80 -right-60 z-0 opacity-20" /> */}
          <AllCollections />
        </Await>
      </Suspense>
    </main>
  );
};
