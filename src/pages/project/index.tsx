import { Suspense, useEffect, useState } from "react";
import { useLoaderData, defer, useParams } from "react-router-dom";
import { Await } from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { CollectionStatsRequest } from "@hellomoon/api";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { motion } from "framer-motion";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

import { Loading } from "../../components/Loading";
import MyMultiButton from "../../components/MyMultiButton";
import TabComponent from "../../components/TabComponent";
import { NftStats } from "../../components/nfts/NftStats";
import { Collection } from "../../data/types";
import { getAllCollection } from "../../utils/collections";
import { client } from "../../utils/hellomoon";

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
      <Suspense fallback={<Loading />}>
        <Await resolve={data}>
          <ProjectDetails />
        </Await>
      </Suspense>
    </div>
  );
};

export const ProjectDetails = () => {
  const { id } = useParams();
  const wallet = useWallet();

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
              className=" object-cover h-full w-full p-4 md:p-20 absolute -z-10 left-0 opacity-10 blur-xl"
            />
            {/* Collection Information */}
            <div className="w-full relative flex flex-col md:flex-row items-center justify-between my-2 h-full bg-black bg-opacity-20 backdrop-blur-lg rounded-lg">
              <div className="w-full md:w-1/3 h-full object-cover flex items-center justify-start">
                <img
                  src={pageCollection.image}
                  alt={id}
                  className="rounded-full object-cover h-full w-full p-4 md:p-20"
                />
              </div>
              <div className="w-full md:w-1/3 flex flex-col gap-4 justify-start items-center text-start flex-grow  p-4 h-full">
                <div className="w-full flex flex-col items-start justify-center gap-4">
                  <p className="w-full font-black truncate text-4xl">
                    {pageCollection.name}
                  </p>
                  <p className="text-sm w-full line-clamp-2 flex-wrap ">
                    {pageCollection.description}
                  </p>
                  <div className="border-b border-b-gray-500 w-full"></div>
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
                <div className="grid grid-cols-2 w-full gap-4 mt-4">
                  <div>
                    <p className="text-sm w-full truncate flex-wrap border border-white border-opacity-20 bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Total Supply:
                      <br /> {collectionStats?.data[0].supply}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm w-full truncate flex-wrap border border-white border-opacity-20 bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Listing Count:
                      <br /> {collectionStats?.data[0].listingCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm w-full truncate flex-wrap border border-white border-opacity-20 bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Floor Price
                      <br />
                      {parseInt(
                        collectionStats?.data[0]?.floorPriceLamports || "0"
                      ) / LAMPORTS_PER_SOL}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm w-full truncate flex-wrap border border-white border-opacity-20 bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Average Price (USD):
                      <br />{" "}
                      {collectionStats?.data[0].avg_price_usd?.toFixed(2) ||
                        "0"}
                    </p>
                  </div>
                </div>
                <div className="w-full col-span-2">
                  {wallet.publicKey && (
                    <NftStats pageCollection={pageCollection} />
                  )}
                </div>
              </div>
            </div>
            {wallet.publicKey ? (
              <TabComponent pageCollection={pageCollection} />
            ) : (
              <div className="flex flex-col h-[50vh] w-full items-center justify-center gap-10">
                <p>Connect your wallet to view your NFTs</p>
                <MyMultiButton />
              </div>
            )}
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
