import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function Categories({ categoryList }) {
  const [numColumns, setNumColumns] = useState(4);

  useEffect(() => {
    setNumColumns(4);
  }, [categoryList]);

  const navigation = useNavigation();

  return (
    <View>
      <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 3 }}>
        Categories
      </Text>
      <FlatList
        data={categoryList}
        numColumns={numColumns}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("item-list", {
                category: item?.name,
              })
            }
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 2,
              borderWidth: 1,
              borderColor: "blue",
              margin: 1,
              height: 80,
              borderRadius: 10,
              backgroundColor: "#F0F8FF",
            }}
          >
            <Image
              source={{ uri: item.icon }}
              style={{ width: 40, height: 40 }}
            />
            <Text style={{ fontSize: 12, marginTop: 1 }}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}
