import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { useUser } from "@clerk/clerk-expo";
import LatesItemList from "../Components/HomeScreen/LatesItemList";
import { useNavigation } from "@react-navigation/native";

export default function MyProducts() {
  const { user } = useUser();
  const db = getFirestore(app);
  const nav = useNavigation();

  const [productList, setProductList] = useState([]);

  const getUserPost = async () => {
    setProductList([]);
    const q = query(
      collection(db, "UserPost"),
      where("userEmail", "==", user?.primaryEmailAddress?.emailAddress)
    );

    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      setProductList((productList) => [...productList, doc.data()]);
    });
  };

  useEffect(() => {
    getUserPost();
  }, []);

  useEffect(() => {
    nav.addListener("focus", (e) => {
      getUserPost();
    });
  }, [nav]);
  return (
    <View>
      <LatesItemList latesItem={productList} heading={""} />
    </View>
  );
}
