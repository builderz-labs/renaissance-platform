import {
  query,
  collection,
  onSnapshot,
  orderBy,
  limit,
  DocumentData,
} from "@firebase/firestore";
import { useEffect, useState } from "react";
import { dbFeed } from "../utils/firebase";

const useRedemptionFeed = () => {
  const [redemptions, setRedemptions] = useState<DocumentData[]>([]);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    const chatRef = collection(dbFeed, "redemptions");
    const q = query(chatRef, orderBy("timestamp", "desc"), limit(10));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const newRedemptions = querySnapshot
          .docChanges()
          .filter((change) => change.type === "added");

        setNewMessagesCount((prevCount) => prevCount + newRedemptions.length);

        const updatedRedemptions = newRedemptions.map((change) => {
          const data = change.doc.data();
          return { ...data, id: change.doc.id };
        });

        setRedemptions(updatedRedemptions);
        setLoading(false);
      },
      (err) => {
        console.log(err);
        setError(true);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const resetNewMessagesCount = () => {
    setNewMessagesCount(0);
  };

  return {
    redemptions,
    loading,
    error,
    newMessagesCount,
    resetNewMessagesCount,
  };
};

export default useRedemptionFeed;
