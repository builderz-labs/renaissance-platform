import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "./firebase"; // Import the 'app' from your firebase.js or firebase.ts file

export const uploadFile = async (file: File, wallet: string) => {
  const storage = getStorage(app);
  const storageRef = ref(storage, `collections/${wallet}.png`);

  const res = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(res.ref);

  return url;
};
