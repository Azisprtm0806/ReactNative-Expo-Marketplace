import React from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import diary from "../../assets/images/diary.png";
import logout from "../../assets/images/logout.png";
import mobileSearch from "../../assets/images/mobile-search.png";

export default function ProfileScreen() {
  const { user } = useUser();
  const navigation = useNavigation();
  const { isLoaded, signOut } = useAuth();

  const menuList = [
    {
      id: 1,
      name: "My Products",
      icon: diary,
      path: "my-products",
    },
    {
      id: 2,
      name: "Explore",
      icon: mobileSearch,
      path: "explore",
    },
    {
      id: 3,
      name: "Logout",
      icon: logout,
    },
  ];

  const onMenuPress = (item) => {
    if (item.name === "Logout") {
      signOut();
      return;
    }
    navigation.navigate(item?.path);
  };

  const renderMenuItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => onMenuPress(item)}
      style={{
        flex: 1,
        padding: 10,
        borderWidth: 1,
        alignItems: "center",
        margin: 2,
        borderRadius: 10,
        borderColor: "blue",
        backgroundColor: "#F0F8FF",
      }}
    >
      {item.icon && (
        <Image source={item?.icon} style={{ width: 50, height: 50 }} />
      )}
      <Text style={{ fontSize: 12, marginTop: 5, color: "blue" }}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image
          source={{ uri: user?.imageUrl }}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text style={{ fontWeight: "bold", fontSize: 25, marginTop: 10 }}>
          {user?.fullName}
        </Text>
        <Text style={{ fontSize: 18, marginTop: 5, color: "#A9A9A9" }}>
          {user?.primaryEmailAddress.emailAddress}
        </Text>
      </View>
      <FlatList
        data={menuList}
        numColumns={3}
        style={{ marginTop: 30 }}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
