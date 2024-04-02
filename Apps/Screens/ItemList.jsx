import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useRoute } from "@react-navigation/native";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import LatesItemList from "../Components/HomeScreen/LatesItemList";

export default function ItemList() {
  const { params } = useRoute();
  const db = getFirestore(app);

  const [itemList, setItemList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getItemListByCategory = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "UserPost"),
        where("category", "==", params.category)
      );
      const snapshot = await getDocs(q);
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setItemList(items);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params) {
      getItemListByCategory();
    }
  }, [params]);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {loading ? (
        <ActivityIndicator className="mt-24" size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : !itemList.length ? (
        <Text className="p-5 text-[20px] mt-24 text-center text-gray-400">
          No Post Found
        </Text>
      ) : (
        <LatesItemList latesItem={itemList} heading={""} />
      )}
    </View>
  );
}
