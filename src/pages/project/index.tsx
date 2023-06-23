import { useLoaderData, defer, useParams } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { Await } from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { Loading } from "../../components/Loading";
import { Collection } from "../../data/types";
import styled from "styled-components";
import { NftStats } from "../../components/nfts/NftStats";
import TabComponent from "../../components/TabComponent";
import { motion } from "framer-motion";
import { CollectionStatsRequest } from "@hellomoon/api";
import { client } from "../../utils/hellomoon";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getAllCollection } from "../../utils/collections";

const Blur1 = styled.div`
  background: linear-gradient(180deg, #e6813e 0%, #00b2ff 100%);
  filter: blur(50.5px);
  width: 260px;
  height: 260px;
`;
const ItemCard = styled.div`
  background: linear-gradient(206.07deg, #050505 30.45%, #101c26 99.29%);
  border: 0.5px solid;
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

export const loader = (queryClient: QueryClient, { params }: any) => {
  if (!params.id) {
    throw new Response("Bad Request", { status: 400 });
  }
  return defer({
    // collections: queryClient.fetchQuery({
    //   queryKey: ["collections"],
    //   queryFn: () => fetch("/data/collections.json").then((res) => res.json()), // /src/data/collections.json
    //   staleTime: 1000 * 60 * 2,
    // }),
    collectionsV1: queryClient.fetchQuery({
      queryKey: ["collectionsV1"],
      queryFn: () => getAllCollection(),
    }),
  });
};

export const ProjectPage = () => {
  const data = useLoaderData() as any;

  return (
    <div className="mt-5 h-full relative">
      {/* <Blur1 className="absolute -top-40 -right-40 z-0 opacity-20" /> */}
      {/* <Blur1 className="absolute top-40 right-40 z-0 opacity-20" /> */}
      <Suspense fallback={<Loading />}>
        <Await resolve={data}>
          <ProjectDetails />
          {/* <Blur1 className="absolute top-80 -right-60 z-0 opacity-20" /> */}
        </Await>
      </Suspense>
    </div>
  );
};

export const ProjectDetails = () => {
  const { id } = useParams();

  // Get Collection
  const { data: collectionsV1 } = useQuery<Collection[]>({
    queryKey: ["collectionsV1"],
  });
  const [pageCollection, setPageCollection] = useState<Collection>();

  const { data: collectionStats } = useQuery({
    queryKey: ["collectionStats", pageCollection?.helloMoonCollectionId],
    queryFn: () =>
      client.send(
        new CollectionStatsRequest({
          helloMoonCollectionId: pageCollection?.helloMoonCollectionId,
          limit: 1,
        })
      ),
    enabled: !!pageCollection?.helloMoonCollectionId,
  });

  useEffect(() => {
    if (collectionsV1) {
      const collection = collectionsV1.find((c: Collection) => c.name === id);
      setPageCollection(collection);
    }
  }, [collectionsV1, id]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mt-5 h-full relative mb-40">
        {pageCollection ? (
          <>
            <img
              src={pageCollection.image}
              alt={id}
              className="rounded-full object-cover h-full w-full p-4 md:p-20 absolute -z-10 left-0 opacity-10"
            />
            {/* Collection Information */}
            <ItemCard className="w-full relative flex flex-col md:flex-row items-center justify-around my-2 h-full bg-black bg-opacity-60 rounded-lg">
              <div className="w-full md:w-1/3 h-full object-cover flex items-center justify-start">
                <img
                  src={pageCollection.image}
                  alt={id}
                  className="rounded-full object-cover h-full w-full p-4 md:p-20"
                />
              </div>
              <div className="bg-black bg-opacity-20 w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 justify-start items-center text-start flex-grow  p-4 h-full">
                <div className="w-full flex flex-col items-start justify-center gap-4">
                  <p className="w-3/4  font-black truncate text-4xl">
                    {pageCollection.name}
                  </p>
                  <p className="text-sm w-3/4 truncate flex-wrap ">
                    {pageCollection.description}
                  </p>
                  <div className="border-b border-b-gray-500 w-3/4"></div>
                  <div className="w-full flex flex-row justify-start gap-4 items-center">
                    {pageCollection.socials.map((social) => (
                      <a
                        target="_blank"
                        href={social.url}
                        key={social.name}
                        rel="noreferrer"
                      >
                        {social.name === "Twitter" && <TwitterIcon />}
                        {social.name === "Discord" && <HeadsetMicIcon />}
                        {social.name === "Website" && <LanguageIcon />}
                      </a>
                    ))}
                  </div>
                </div>
                <div className=" grid grid-cols-2 w-full gap-4">
                  <div>
                    <p className="text-sm w-full truncate flex-wrap bg-renaissance-orange bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Total Supply:
                      <br /> {collectionStats?.data[0].supply}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm w-full truncate flex-wrap bg-renaissance-orange bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Listing Count:
                      <br /> {collectionStats?.data[0].listingCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm w-full truncate flex-wrap bg-renaissance-orange bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Floor Price
                      <br />
                      {parseInt(
                        collectionStats?.data[0]?.floorPriceLamports || "0"
                      ) / LAMPORTS_PER_SOL}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm w-full truncate flex-wrap bg-renaissance-orange bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Average Price (USD):
                      <br />{" "}
                      {collectionStats?.data[0].avg_price_usd?.toFixed(2) ||
                        "0"}
                    </p>
                  </div>
                </div>
                <div className="w-full col-span-2">
                  <NftStats pageCollection={pageCollection} />
                </div>
              </div>
            </ItemCard>
            <TabComponent pageCollection={pageCollection} />
          </>
        ) : (
          <div className="flex flex-col h-[50vh] w-full items-center justify-center gap-10">
            <p>Collection not found </p>
            <a href="/" className="btn">
              Slowly go back home
            </a>
          </div>
        )}
      </div>
    </motion.div>
  );
};
