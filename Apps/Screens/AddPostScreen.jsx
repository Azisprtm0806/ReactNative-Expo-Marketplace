import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Image,
  ToastAndroid,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "../../firebaseConfig";
import { Formik } from "formik";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useUser } from "@clerk/clerk-expo";

export default function AddPostScreen() {
  const db = getFirestore(app);
  const storage = getStorage();

  const { user } = useUser();

  const [image, setImage] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCategoryList = async () => {
    setCategoryList([]);
    const querySnapshot = await getDocs(collection(db, "Category"));

    querySnapshot.forEach((doc) => {
      setCategoryList((categoryList) => [...categoryList, doc.data()]);
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  const onSubmitMethod = async (value, resetForm) => {
    setLoading(true);

    const response = await fetch(image);
    const blob = await response.blob();

    const storageRef = ref(storage, "marketplace-post/" + Date.now() + ".jpg");

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
      })
      .then((resp) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          value.image = downloadUrl;
          value.userName = user.fullName;
          value.userEmail = user.primaryEmailAddress.emailAddress;
          value.userImage = user.imageUrl;

          const docRef = await addDoc(collection(db, "UserPost"), value);
          if (docRef.id) {
            setLoading(false);
            Alert.alert("success!!", "Post Added Successfully.", [
              {
                text: "OK",
                onPress: () => {
                  resetForm();
                  setImage(null);
                },
              },
            ]);
          }
        });
      });
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView className="p-10">
        <Text className="text-[25px] font-bold mt-4">Add New Post</Text>
        <Text className="text-[16px] text-gray-500 mb-10">
          Create new post and start selling
        </Text>
        <Formik
          initialValues={{
            title: "",
            desc: "",
            category: "",
            address: "",
            price: "",
            image: "",
            userName: "",
            userEmail: "",
            userImage: "",
            createdAt: Date.now(),
          }}
          onSubmit={(value, { resetForm }) => onSubmitMethod(value, resetForm)}
          validate={(values) => {
            // const errors = {};
            // if (
            //   !values.title ||
            //   !values.desc ||
            //   !values.category ||
            //   !values.address ||
            //   !values.price
            // ) {
            //   ToastAndroid.show("Please fill in required", ToastAndroid.SHORT);
            //   errors.name = "Please fill in required";
            // }
            // return errors;
          }}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            setFieldValue,
            errors,
          }) => (
            <View>
              <TouchableOpacity onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                  />
                ) : (
                  <Image
                    source={require("../../assets/images/placeholder.png")}
                    style={{ width: 100, height: 100, borderRadius: 15 }}
                  />
                )}
              </TouchableOpacity>
              <TextInput
                style={style.input}
                placeholder="Title"
                value={values?.title}
                onChangeText={handleChange("title")}
              />
              <TextInput
                style={style.input}
                placeholder="Description"
                value={values?.desc}
                numberOfLines={5}
                onChangeText={handleChange("desc")}
              />
              <TextInput
                style={style.input}
                placeholder="Price"
                value={values?.price}
                keyboardType="number-pad"
                onChangeText={handleChange("price")}
              />
              <TextInput
                style={style.input}
                placeholder="Address"
                value={values?.address}
                onChangeText={handleChange("address")}
              />
              <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 10 }}>
                <Picker
                  selectedValue={values?.category}
                  onValueChange={(itemValue) =>
                    setFieldValue("category", itemValue)
                  }
                  className="border-2"
                >
                  {categoryList &&
                    categoryList.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item.name}
                        value={item.name}
                      />
                    ))}
                </Picker>
              </View>

              <TouchableOpacity
                onPress={handleSubmit}
                style={{
                  backgroundColor: loading ? "#ccc" : "#007BFF",
                }}
                disabled={loading}
                className="p-5 bg-blue-500 rounded-full mt-10"
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center font-bold text-[16px]">
                    Submit
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const style = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 17,
    textAlignVertical: "top",
    fontSize: 17,
  },
});
