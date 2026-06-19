// hooks/useQuotes.ts
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Quote {
  id: string;
  clientName: string;
  clientPhone: string;
  unitName: string;
  location: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  nightlyRate: number;
  totalAmount: number;
  createdAt: string;
}

const fetchQuotes = async (): Promise<Quote[]> => {
  const quotesRef = collection(db, "quotes");
  // Order by creation date, newest first
  const q = query(quotesRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Quote);
};

export function useQuotes() {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: fetchQuotes,
  });
}
