import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  where,
  limit,
  query,
} from "@firebase/firestore";
import { uploadFile } from "./uploadFile";
import { PublicKey } from "@solana/web3.js";

interface Social {
  name: string;
  url: string;
}

interface CollectionObj {
  authority: string; // You may want to replace `any` with the specific type of `authorityWallet`.
  name: string;
  description: string;
  collectionAddresses: string[];
  helloMoonCollectionId: string;
  image: string;
  socials: Social[];
  fee: number;
}

export const getAllCollection = async () => {
  const documentCollection = collection(db, "collections");
  const snapshot = await getDocs(documentCollection);
  const docs = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
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
  helloMoonId: string,
  file: File
) => {
  const collectionRef = collection(db, "collections");

  const imageUrl = await uploadFile(file, authorityWallet);

  const collectionObj: CollectionObj = {
    authority: authorityWallet,
    name,
    description,
    collectionAddresses: [collectionAddress],
    helloMoonCollectionId: helloMoonId,
    image: imageUrl,
    fee: 0.2,
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

  await addDoc(collectionRef, collectionObj);
};

export const updateCollection = async (
  authorityWallet: string,
  docId: string,
  data: Partial<CollectionObj>
) => {
  const docRef = doc(db, "collections", docId);
  await updateDoc(docRef, data);
};

export const getAuthorityCollections = async (publicKey: PublicKey) => {
  const collectionsRef = collection(db, "collections");
  const q = query(
    collectionsRef,
    where("authority", "==", publicKey.toBase58()),
    limit(10)
  );

  const querySnapshot = await getDocs(q);
  const docs = querySnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));

  return docs;
};
