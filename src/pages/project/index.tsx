import { useLoaderData, defer, useParams } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { Await } from "react-router-dom";
import { QueryClient, useQuery } from "@tanstack/react-query";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { Loading } from "../../components/Loading";
import { Collection } from "../../data/types";
import { NftListRedemption } from "../../components/project/NftListRedemption";
import styled from "styled-components";
import { NftStats } from "../../components/nfts/NftStats";
import TabComponent from '../../components/TabComponent';

const Blur1 = styled.div`
  background: linear-gradient(180deg, #e6813e 0%, #00b2ff 100%);
  filter: blur(50.5px);
  width: 260px;
  height: 260px;
`;

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

export const loader = (queryClient: QueryClient, { params }: any) => {
  if (!params.id) {
    throw new Response("Bad Request", { status: 400 });
  }
  return defer({
    collections: queryClient.fetchQuery({
      queryKey: ["collections"],
      queryFn: () =>
        fetch('/data/collections.json').then(res => res.json()), // /src/data/collections.json
      staleTime: 1000 * 60 * 2,
    }),
  });
};

export const ProjectPage = () => {
  const data = useLoaderData() as any;

  return (
    <div className="mt-5 h-full relative">
      <Blur1 className="absolute -top-40 -right-40 z-0 opacity-20" />
      <Blur1 className="absolute top-40 right-40 z-0 opacity-20" />
      <Suspense fallback={<Loading />}>
        <Await resolve={data}>
          <ProjectDetails />
          <Blur1 className="absolute top-80 -right-60 z-0 opacity-20" />
        </Await>
      </Suspense>
    </div>
  );
};

export const ProjectDetails = () => {
  const { id } = useParams();

  // Get Collection
  const { data: collections } = useQuery<Collection[]>({
    queryKey: ["collections"],
  });
  const [pageCollection, setPageCollection] = useState<Collection>();

  useEffect(() => {
    if (collections) {
      const collection = collections.find((c: Collection) => c.name === id);
      setPageCollection(collection);
    }
  }, [collections, id]);

  return (
    <div>
      <div className="mt-5 h-full relative mb-40">
        {pageCollection ? (
          <>
            <img
              src={pageCollection.image}
              alt={id}
              className="rounded-full object-cover h-full w-full p-4 md:p-20 absolute -z-10 left-0 opacity-10"
            />
            {/* Collection Information */}
            <div className="w-full relative flex flex-col md:flex-row items-center justify-around my-2 h-full bg-black bg-opacity-60 rounded-lg">
              <div className="w-full md:w-1/3 h-full object-cover flex items-center justify-start">
                <img
                  src={pageCollection.image}
                  alt={id}
                  className="rounded-full object-cover h-full w-full p-4 md:p-20"
                />

              </div>
              <div className="bg-black bg-opacity-20 w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 justify-start items-center text-start flex-grow  p-4 h-full">
                <div className='w-full flex flex-col items-start justify-center gap-4'>
                  <p className="w-3/4  font-black truncate text-4xl">
                    {pageCollection.name}
                  </p>
                  <p className="text-sm w-3/4 truncate flex-wrap ">
                    {pageCollection.description}
                  </p>
                  <div className="border-b border-b-gray-500 w-3/4"></div>
                  <div className="w-full flex flex-row justify-start gap-4 items-center">
                    {pageCollection.socials.map((social) => (
                      <a target="_blank" href={social.url} key={social.name}>
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
                      Total Supply:<br /> 10,000
                    </p>
                  </div>
                  <div>
                    <p className="text-sm w-full truncate flex-wrap bg-renaissance-orange bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Volume(7D):<br /> 10,000
                    </p>
                  </div>
                  <div>
                    <p className="text-sm w-full truncate flex-wrap bg-renaissance-orange bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Buy Now:<br /> 10,000
                    </p>
                  </div>
                  <div>
                    <p className="text-sm w-full truncate flex-wrap bg-renaissance-orange bg-opacity-10 backdrop-blur-lg p-4 rounded-lg">
                      Instant Sell:<br /> 10,000
                    </p>
                  </div>
                </div>
                <div className="w-full col-span-2"><NftStats pageCollection={pageCollection} /></div>
              </div>
            </div>
            {/* NFT Stats */}
            {/* NFT List */}
            <TabComponent pageCollection={pageCollection} />
          </>
        ) : (
          <div className='flex flex-col h-[50vh] w-full items-center justify-center gap-10'>
            <p>Collection not found </p>
            <a href="/" className='btn'>Slowly go back home</a>
          </div>
        )}
      </div>
    </div>
  );
};
