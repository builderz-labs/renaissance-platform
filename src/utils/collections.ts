import { firestore } from "./firebase";
import { collection, getDocs, addDoc } from "@firebase/firestore";

export const getAllCollection = async () => {
  try {
    const documentCollection = collection(firestore, "collections");
    const snapshot = await getDocs(documentCollection);
    const docs = snapshot.docs.map((doc) => ({ id: doc.id, data: doc.data() }));
    console.log(docs);
    return docs;
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};

export const addNewCollection = async (nftMint: string) => {
  try {
    const documentCollection = collection(firestore, "collections");

    const docRef = await addDoc(documentCollection, {
      name,
      description,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
  }
};
