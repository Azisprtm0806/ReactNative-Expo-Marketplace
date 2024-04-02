import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatesItemList from "../Components/HomeScreen/LatesItemList";

export default function ExploreScreen() {
  const db = getFirestore(app);

  const [productList, setProducList] = useState([]);

  const getAllProducts = async () => {
    setProducList([]);
    const q = query(collection(db, "UserPost"), orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    snapshot.forEach((doc) => {
      setProducList((productList) => [...productList, doc.data()]);
    });
  };

  useEffect(() => {
    getAllProducts();
  }, []);
  return (
    <ScrollView className="p-5 py-8">
      <Text className="text-[24px] font-bold">Explore More</Text>
      <LatesItemList latesItem={productList} heading={""} />
    </ScrollView>
  );
}
