import React, { Suspense } from "react";
import styled from "styled-components";
import { Loading } from "../components/Loading";
import { Await, useLoaderData } from "react-router-dom";
import FeaturedList from "../components/home/FeaturedList";
import { AllCollections } from "../components/home/AllCollections";

const Blur1 = styled.div`
  background: linear-gradient(180deg, #e6813e 0%, #00b2ff 100%);
  filter: blur(50.5px);
  width: 260px;
  height: 260px;
`;

function ExplorePage() {
  const { collections } = useLoaderData() as any;

  return (
    <main className="h-full max-w-full relative">
      {/* <Blur1 className="absolute -top-40 -right-40 z-0 opacity-20" /> */}
      {/* <Blur1 className="absolute top-40 right-40 -z-10 opacity-20" /> */}
      <Suspense fallback={<Loading />}>
        <Await resolve={collections}>
          <section className="mt-5">
            <FeaturedList />
          </section>
          {/* <Blur1 className="absolute top-80 -right-60 z-0 opacity-20" /> */}
          <AllCollections />
        </Await>
      </Suspense>
    </main>
  );
}

export default ExplorePage;
