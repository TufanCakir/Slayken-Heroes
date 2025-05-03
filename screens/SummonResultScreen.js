import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ImageBackground } from "expo-image";
import StaticCard from "../components/StaticCard";
import attackZone from "../data/attackZone.json";

const { width, height } = Dimensions.get("window");

export default function SummonResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { results } = route.params || { results: [] };

  return (
    <View style={styles.container}>
      <ImageBackground source={attackZone.image} style={styles.backgroundImage}>
        <FlatList
          data={results}
          keyExtractor={(item, idx) => `${item}-${idx}`}
          contentContainerStyle={styles.list}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <StaticCard
                variant={item}
                label={item}
                width={140}
                height={180}
              />
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Zurück</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
  },
  list: {
    paddingBottom: 80,
    justifyContent: "center",
  },
  cardWrapper: {
    flex: 1,
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#006494",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});
