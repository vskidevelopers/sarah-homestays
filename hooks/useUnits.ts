// hooks/useUnits.ts
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Unit } from "@/types";

const fetchUnits = async (): Promise<Unit[]> => {
  const unitsRef = collection(db, "units");
  const q = query(unitsRef, where("isActive", "==", true));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Unit);
};

export function useUnits() {
  return useQuery({
    queryKey: ["units"],
    queryFn: fetchUnits,
  });
}
