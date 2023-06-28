import {
  collection,
  query,
  getDocs,
  orderBy,
  limit,
} from "@firebase/firestore";
import { dbFeed } from "../utils/firebase";

export const getLatestRedemptions = async () => {
  const redemptionsRef = collection(dbFeed, "redemptions");
  const q = query(redemptionsRef, orderBy("timestamp", "desc"), limit(10));

  const querySnapshot = await getDocs(q);
  const redemptions = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return { ...data, id: doc.id };
  });

  return redemptions;
};
