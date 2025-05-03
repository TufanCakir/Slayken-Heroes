import React from "react";
import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native";
import { ImageBackground } from "expo-image";
import { useGame } from "../hooks/useGame";
import Footer from "../components/Footer";
import Header from "../components/Header";
import StaticCard from "../components/StaticCard";
import attackZone from "../data/attackZone.json";

const { width, height } = Dimensions.get("window");

export default function CardListScreen() {
  const { summons } = useGame();

  return (
    <View style={styles.container}>
      <ImageBackground source={attackZone.image} style={styles.backgroundImage}>
        <Header />

        {summons.length === 0 ? (
          <Text style={styles.emptyText}>Keine Karten gefunden. 🚫</Text>
        ) : (
          <FlatList
            data={summons}
            keyExtractor={(item, index) => `${item}-${index}`}
            numColumns={2}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <StaticCard
                  variant={item}
                  label={item.toUpperCase()}
                  width={140}
                  height={200}
                />
              </View>
            )}
          />
        )}

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
    paddingTop: 20,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  cardWrapper: {
    flex: 1,
    alignItems: "center",
    padding: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#aaa",
    fontSize: 16,
    marginTop: 40,
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
