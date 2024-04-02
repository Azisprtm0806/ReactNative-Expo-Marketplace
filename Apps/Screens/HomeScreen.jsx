import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import Header from "../Components/HomeScreen/Header";
import Sliders from "../Components/HomeScreen/Sliders";
import { collection, getDocs, getFirestore, orderBy } from "firebase/firestore";
import { app } from "../../firebaseConfig";
import Categories from "../Components/HomeScreen/Categories";
import LatesItemList from "../Components/HomeScreen/LatesItemList";

export default function HomeScreen() {
  const db = getFirestore(app);

  const [sliderList, setSliderList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [latesItem, setLatesItem] = useState([]);

  const getSliders = async () => {
    setSliderList([]);
    const querySnapshot = await getDocs(collection(db, "Sliders"));

    querySnapshot.forEach((doc) => {
      setSliderList((sliderList) => [...sliderList, doc.data()]);
    });
  };

  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, "Category"));

    querySnapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  const getLatestItemList = async () => {
    setLatesItem([]);
    const querySnapshot = await getDocs(
      collection(db, "UserPost"),
      orderBy("createdAt", "desc")
    );

    querySnapshot.forEach((doc) => {
      setLatesItem((latesItem) => [...latesItem, doc.data()]);
    });
  };

  useEffect(() => {
    getSliders();
    getCategoryList();
    getLatestItemList();
  }, []);

  return (
    <ScrollView className="py-8 px-6 bg-white flex-1">
      <Header />
      <Sliders sliderList={sliderList} />

      <Categories categoryList={categoryList} />
      <LatesItemList latesItem={latesItem} heading={"Lates Items"} />
    </ScrollView>
  );
}
