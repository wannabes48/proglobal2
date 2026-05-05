import { addDoc, collection } from "firebase/firestore";
import { db } from "./firebase";

export const createNotification = async (userId: string, title: string, message: string, type: 'transaction' | 'investment' | 'security' | 'info' = 'info') => {
  try {
    await addDoc(collection(db, "notifications"), {
      user_id: userId,
      title,
      message,
      type,
      read: false,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Failed to create notification:", err);
  }
};
