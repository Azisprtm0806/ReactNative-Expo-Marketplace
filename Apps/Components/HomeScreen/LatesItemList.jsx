import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import PostItem from "./PostItem";

export default function LatesItemList({ latesItem, heading }) {
  const [numColumns, setNumColumns] = useState(2);

  useEffect(() => {
    setNumColumns(2);
  }, [latesItem]);

  return (
    <SafeAreaView style={{ marginTop: 3, marginBottom: 10 }}>
      <Text style={{ fontWeight: "bold", fontSize: 16 }}>{heading}</Text>
      <FlatList
        data={latesItem}
        numColumns={numColumns}
        renderItem={({ item, index }) => <PostItem item={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </SafeAreaView>
  );
}
