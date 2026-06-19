// lib/firestore.ts
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./firebase";
import { Unit } from "@/types";

export async function getActiveUnits(): Promise<Unit[]> {
  const unitsRef = collection(db, "units");
  // Only fetch units Sarah has marked as active
  const q = query(unitsRef, where("isActive", "==", true));

  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      }) as Unit,
  );
}
