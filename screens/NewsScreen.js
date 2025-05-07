// screens/NewsScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { ImageBackground } from "expo-image";
import Header from "../components/Header";
import Footer from "../components/Footer";
import attackZone from "../data/attackZone.json";

const { width, height } = Dimensions.get("window");

const newsData = [
  {
    id: "1",
    title: "Neues Event gestartet Coin Rush!",
    description: "Verdiene mehr Coins als üblich!",
    image:
      "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/animals/dinoken.png",
  },
  {
    id: "2",
    title: "Neues Event gestartet Crystal Rush!",
    description: "Verdiene mehr Crystals als üblich!",
    image:
      "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/animals/leonken.png",
  },
  {
    id: "3",
    title: "Neues Event gestartet Exp Rush!",
    description: "Verdiene mehr exp als üblich!",
    image:
      "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/animals/euleken.png",
  },
  {
    id: "4",
    title: "Neues Event gestartet Dinoken!",
    description: "Kämpfe gegen den Mächtigen Dinoken!",
    image:
      "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/animals/dinoken.png",
  },
];

export default function NewsScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ImageBackground source={attackZone.image} style={styles.backgroundImage}>
        <Header />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {newsData.map((news) => (
            <TouchableOpacity
              key={news.id}
              style={styles.newsCard}
              activeOpacity={0.8}
              onPress={() => {
                // später: Detailscreen anzeigen
                console.log(`News ${news.id} angeklickt`);
              }}
            >
              <Image
                source={news.image}
                style={styles.newsImage}
                contentFit="contain"
              />
              <View style={styles.textWrapper}>
                <Text style={styles.newsTitle}>{news.title}</Text>
                <Text style={styles.newsDescription}>{news.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Footer />
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  newsCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    elevation: 4,
    alignItems: "center",
  },
  newsImage: {
    width: "100%",
    height: 200,
  },
  textWrapper: {
    padding: 12,
  },
  newsTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  newsDescription: {
    color: "#fff",
    fontSize: 16,
  },
});
