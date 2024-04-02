import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";

export default function ProductDetail({ navigation }) {
  const { params } = useRoute();
  const [product, setProduct] = useState([]);
  const db = getFirestore(app);
  const nav = useNavigation();

  const { user } = useUser();
  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <Ionicons
          name="share-social-sharp"
          size={24}
          color="white"
          style={{ marginRight: 15 }}
          onPress={() => shareProduct()}
        />
      ),
    });
  };

  const shareProduct = () => {
    const content = {
      message: product?.title + "\n" + product?.desc,
    };
    Share.share(content).then(
      (resp) => {
        console.log(resp);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  useEffect(() => {
    params && setProduct(params.product);
    shareButton();
  }, [params]);

  const sendEmailMessage = () => {
    const subject = "Regarding" + product.title;
    const body = `Hi ${product.userName} \n I am intrested in this product`;
    Linking.openURL(
      "mailto:" + product.userEmail + "?subject" + subject + "&body" + body
    );
  };

  const deleteUserPost = () => {
    Alert.alert("Do you want to Delete?", "Are you want to delete this post?", [
      {
        text: "Yes",
        onPress: () => deleteFromFireStore(),
      },
      {
        text: "Cancel",
        onPress: () => nav.goBack(),
        style: "cancel",
      },
    ]);
  };

  const deleteFromFireStore = async () => {
    try {
      const q = query(
        collection(db, "UserPost"),
        where("title", "==", product.title)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        deleteDoc(doc.ref).then((rsp) => {
          nav.goBack();
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ScrollView className="bg-white">
      <Image source={{ uri: product.image }} className="h-[320px] w-full" />

      <View className="p-3 mb-4">
        <Text className="text-[24px] font-bold">{product?.title}</Text>
        <View className="items-baseline">
          <Text className="rounded-lg p-1 px-2 mt-2 bg-blue-200 text-blue-500">
            {product.category}
          </Text>
        </View>
        <Text className="mt-3 font-bold text-[20px]">Description</Text>
        <Text className="text-[17px] text-gray-500">{product?.desc}</Text>
      </View>

      <View className="p-3 flex flex-row items-center gap-3 bg-blue-100  border-blue-500">
        <Image
          source={{ uri: product.userImage }}
          className="w-12 h-12 rounded-full"
        />
        <View>
          <Text className="font-bold text-[18px]">{product.userName}</Text>
          <Text className="text-gray-500">{product.userEmail}</Text>
        </View>
      </View>

      {user?.primaryEmailAddress?.emailAddress == product.userEmail ? (
        <TouchableOpacity
          onPress={() => deleteUserPost()}
          className="z-40 bg-red-500 rounded-full  p-4 m-4"
        >
          <Text className="text-center text-white">Delete Post</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => sendEmailMessage()}
          className="z-40 bg-blue-500 rounded-full  p-4 m-4"
        >
          <Text className="text-center text-white">Send Message</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
