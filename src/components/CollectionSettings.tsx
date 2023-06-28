import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback } from "react";
import {
  getAuthorityCollections,
  updateCollection,
} from "../utils/collections";
import { useQuery } from "@tanstack/react-query";

type FormData = {
  collectionAddresses: string[];
  helloMoonCollectionId: string;
  image: string;
  name: string;
  description: string;
  socials: {
    name: string;
    url: string;
  }[];
};

export const CollectionSettings = () => {
  const wallet = useWallet();
  const [collectionToEdit, setCollectionToEdit] = useState<string | null>(null);
  const [originalData, setOriginalData] = useState<FormData | null>(null);
  const [formData, setFormData] = useState<FormData>({
    collectionAddresses: [],
    helloMoonCollectionId: "",
    image: "",
    name: "",
    description: "",
    socials: [
      { name: "Discord", url: "" },
      { name: "Twitter", url: "" },
      { name: "Website", url: "" },
    ],
  });

  const fetchAuthorityCollections = useCallback(async () => {
    return getAuthorityCollections(wallet.publicKey!);
  }, [wallet.publicKey]);

  const {
    data: authorityCollections,
    isLoading,
    error,
    refetch,
  } = useQuery<any[]>(
    ["authorityCollections", wallet.publicKey],
    fetchAuthorityCollections,
    {
      enabled: !!wallet.publicKey,
    }
  );

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;

    if (name === "collectionAddresses") {
      setFormData({
        ...formData,
        collectionAddresses: value.split(",").map((addr: any) => addr.trim()),
      });
    } else if (name.startsWith("socials")) {
      setFormData({
        ...formData,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleEditClick = (collection: any) => {
    // Convert the socials to the required format
    const socials = Object.fromEntries(
      collection.socials.map(({ name, url }: any) => [name.toLowerCase(), url])
    );

    // Convert the collection data to form data
    const formData = {
      ...collection,
      ...socials,
    };

    // Set both formData and originalData
    setFormData(formData);
    setOriginalData(formData);

    setCollectionToEdit(collection.id);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!wallet.publicKey || !collectionToEdit || !originalData) {
      return;
    }

    // Calculate the updated fields
    const updatedFields: Partial<FormData> = {};
    for (const key in formData) {
      if (
        formData[key as keyof FormData] !== originalData[key as keyof FormData]
      ) {
        updatedFields[key as keyof FormData] = formData[
          key as keyof FormData
        ] as (string & string[] & { name: string; url: string }[]) | undefined;
      }
    }

    console.log(updatedFields);

    await updateCollection(
      wallet.publicKey.toBase58(),
      collectionToEdit,
      updatedFields
    );

    setCollectionToEdit(null);
    refetch();
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) return <p>Error</p>;

  if (!authorityCollections?.length) return <p>No collections found.</p>;

  return (
    <div className="grid grid-cols-2 gap-4">
      {authorityCollections.map((collection) => (
        <div key={collection.id} className="border p-4 rounded shadow">
          <h2 className="font-bold mb-2">{collection.name}</h2>
          <p className="mb-2">
            Collection Addresses: {collection.collectionAddresses.join(", ")}
          </p>
          <p className="mb-2">
            Hello Moon Collection ID: {collection.helloMoonCollectionId}
          </p>
          <p className="mb-2">Description: {collection.description}</p>
          <div className="mb-2">
            <h3 className="font-bold">Socials:</h3>
            {collection.socials.map((social: any, index: any) => (
              <p key={index}>
                {social.name}: {social.url}
              </p>
            ))}
          </div>
          <img className="mb-2" src={collection.image} alt={collection.name} />
          {collectionToEdit === collection.id ? (
            <form onSubmit={handleSubmit}>
              <label className="block">
                Collection Addresses:
                <input
                  type="text"
                  name="collectionAddresses"
                  value={formData.collectionAddresses.join(", ")}
                  onChange={handleInputChange}
                  className="mb-2 p-1 border rounded"
                />
              </label>
              <label className="block">
                Hello Moon Collection ID:
                <input
                  type="text"
                  name="helloMoonCollectionId"
                  value={formData.helloMoonCollectionId}
                  onChange={handleInputChange}
                  className="mb-2 p-1 border rounded"
                />
              </label>
              <label className="block">
                Description:
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mb-2 p-1 border rounded"
                />
              </label>
              <label className="block">
                Image URL:
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="mb-2 p-1 border rounded"
                />
              </label>
              <label className="block">
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mb-2 p-1 border rounded"
                />
              </label>
              <label className="block">
                Discord URL:
                <input
                  type="text"
                  name="discord"
                  value={
                    formData.socials.find(({ name }) => name === "Discord")?.url
                  }
                  onChange={handleInputChange}
                  className="mb-2 p-1 border rounded"
                />
              </label>
              <label className="block">
                Twitter URL:
                <input
                  type="text"
                  name="twitter"
                  value={
                    formData.socials.find(({ name }) => name === "Twitter")?.url
                  }
                  onChange={handleInputChange}
                  className="mb-2 p-1 border rounded"
                />
              </label>
              <label className="block">
                Website URL:
                <input
                  type="text"
                  name="website"
                  value={
                    formData.socials.find(({ name }) => name === "Website")?.url
                  }
                  onChange={handleInputChange}
                  className="mb-2 p-1 border rounded"
                />
              </label>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
          ) : (
            <button
              onClick={() => handleEditClick(collection)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CollectionSettings;
