import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { ImageBackground } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import attackZone from "../data/attackZone.json";

const { width, height } = Dimensions.get("window");

export default function ShopScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={attackZone.image} style={styles.backgroundImage}>
        <Header />

        <ScrollView contentContainerStyle={styles.shopContainer}>
          <View style={styles.itemCard}>
            <Text style={styles.itemText}>Shop Items Coming Soon</Text>
          </View>
        </ScrollView>

        <View style={styles.footerWrapper}>
          <Footer />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
  },
  shopContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  itemCard: {
    backgroundColor: "#003b5a",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#00d2ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  itemText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
