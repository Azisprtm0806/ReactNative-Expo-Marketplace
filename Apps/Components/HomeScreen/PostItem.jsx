import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

export default function PostItem({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="flex-1 m-2 p-2  rounded-lg border-[1px] border-slate-300"
      onPress={() =>
        navigation.push("product-detail", {
          product: item,
        })
      }
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-[140px] rounded-lg"
      />
      <View>
        <Text className="text-[15px] font-bold mt-2">{item.title}</Text>
        <Text className="text-[18px] font-bold text-blue-400">
          Rp. {item.price}
        </Text>
        <Text className="text-blue-500 text-center mt-1 bg-blue-200 p-1 rounded-full px-1 text-[10px] w-[70px]">
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
