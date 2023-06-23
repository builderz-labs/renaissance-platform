import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  updateDoc,
} from "@firebase/firestore";
import { uploadFile } from "./uploadFile";

interface Social {
  name: string;
  url: string;
}

interface CollectionObj {
  authority: string; // You may want to replace `any` with the specific type of `authorityWallet`.
  name: string;
  description: string;
  collectionAddresses: string[];
  image: string;
  socials: Social[];
}

export const getAllCollection = async () => {
  const documentCollection = collection(db, "collections");
  const snapshot = await getDocs(documentCollection);
  const docs = snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
  console.log(docs);
  return docs;
};

export const addCollection = async (
  authorityWallet: string,
  name: string,
  description: string,
  twitter: string,
  discord: string,
  website: string,
  collectionAddress: string,
  file: File
) => {
  const collectionRef = doc(db, "collections", authorityWallet);

  const imageUrl = await uploadFile(file, authorityWallet);

  const collectionObj: CollectionObj = {
    authority: authorityWallet,
    name,
    description,
    collectionAddresses: [collectionAddress],
    image: imageUrl,
    socials: [
      {
        name: "Twitter",
        url: twitter,
      },
      {
        name: "Discord",
        url: discord,
      },
      {
        name: "Website",
        url: website,
      },
    ],
  };

  await setDoc(collectionRef, collectionObj);
};

export const updateCollection = async (
  authorityWallet: string,
  data: Partial<CollectionObj>
) => {
  const collectionRef = doc(db, "collections", authorityWallet);
  await updateDoc(collectionRef, data);
};
