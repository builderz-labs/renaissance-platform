import { QueryClient } from "@tanstack/react-query";
import FeaturedList from "../components/home/FeaturedList";
import { Suspense } from "react";
import { AllCollections } from "../components/home/AllCollections";
import { Await, defer, useLoaderData } from "react-router-dom";
import { Loading } from "../components/Loading";
import { fetchLeaderboard } from "../utils/history";
import HeaderBanner from "../components/HeaderBanner";
import { getAllCollection } from "../utils/collections";
import { Leaderboard2 } from "../components/home/Leaderboard2";
import { getLatestRedemptions } from "../utils/redemptions";

export const loader = (queryClient: QueryClient) => {
  return defer({
    leaderboard: queryClient.fetchQuery({
      queryKey: ["leaderboard"],
      queryFn: () => fetchLeaderboard(),
    }),
    collectionsV1: queryClient.fetchQuery({
      queryKey: ["collectionsV1"],
      queryFn: () => getAllCollection(),
    }),
    redemptionFeed: queryClient.fetchQuery({
      queryKey: ["redemptionFeed"],
      queryFn: () => getLatestRedemptions(),
    }),
  });
};

export const HomePage = () => {
  const { collectionsV1 } = useLoaderData() as any;

  return (
    <main className="h-full max-w-full relative">
      <Suspense fallback={<Loading />}>
        <Await resolve={collectionsV1}>
          <HeaderBanner />
          <section className="mt-5">
            <FeaturedList />
          </section>
          <section className="">
            <Leaderboard2 />
          </section>
          <AllCollections />
        </Await>
      </Suspense>
    </main>
  );
};
