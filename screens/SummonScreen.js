import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGame } from "../hooks/useGame";
import { ImageBackground } from "expo-image";
import CARD_THEMES from "../data/cardThemes.json";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import attackZone from "../data/attackZone.json";

const { width, height } = Dimensions.get("window");
const SUMMONS_KEY = "summons";

function getRandomVariant() {
  const variants = Object.keys(CARD_THEMES).filter((key) => key !== "default");
  const index = Math.floor(Math.random() * variants.length);
  return variants[index];
}

export default function SummonScreen() {
  const navigation = useNavigation();
  const { crystals, spendCrystals, addSummon } = useGame();

  const persistSummons = async (newVariantArray) => {
    try {
      await AsyncStorage.setItem(SUMMONS_KEY, JSON.stringify(newVariantArray));
    } catch (e) {
      console.error("Fehler beim Speichern von Summons:", e);
    }
  };

  const doSingleSummon = async () => {
    const cost = 5;
    if (crystals < cost) {
      Alert.alert("Nicht genügend Kristalle", `Du brauchst ${cost} Kristalle.`);
      return;
    }
    spendCrystals(cost);
    const variant = getRandomVariant();
    addSummon(variant);

    const stored = await AsyncStorage.getItem(SUMMONS_KEY);
    const existing = stored ? JSON.parse(stored) : [];
    const updated = [...existing, variant];
    await persistSummons(updated);

    navigation.navigate("SummonResultScreen", { results: [variant] });
  };

  const doMultiSummon = async () => {
    const cost = 50;
    const count = 10;
    if (crystals < cost) {
      Alert.alert("Nicht genügend Kristalle", `Du brauchst ${cost} Kristalle.`);
      return;
    }
    spendCrystals(cost);

    const stored = await AsyncStorage.getItem(SUMMONS_KEY);
    const existing = stored ? JSON.parse(stored) : [];
    const results = [];

    for (let i = 0; i < count; i++) {
      const variant = getRandomVariant();
      addSummon(variant);
      results.push(variant);
    }
    const updatedAll = [...existing, ...results];
    await persistSummons(updatedAll);

    navigation.navigate("SummonResultScreen", { results });
  };

  const confirmSingleSummon = () => {
    Alert.alert(
      "Single Summon",
      "Möchtest du wirklich einen Single Summon für 5 Kristalle durchführen?",
      [
        { text: "Abbrechen", style: "cancel" },
        { text: "Ja", onPress: doSingleSummon },
      ]
    );
  };

  const confirmMultiSummon = () => {
    Alert.alert(
      "Multi Summon",
      "Möchtest du wirklich einen Multi Summon für 50 Kristalle durchführen?",
      [
        { text: "Abbrechen", style: "cancel" },
        { text: "Ja", onPress: doMultiSummon },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={attackZone.image} style={styles.backgroundImage}>
        <View style={styles.header}>
          <Header />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={confirmSingleSummon}>
            <Text style={styles.buttonText}>Single</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={confirmMultiSummon}>
            <Text style={styles.buttonText}>Multi</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: "#000",
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 0,
    width: "100%",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    backgroundColor: "#003b5a",
    paddingVertical: 18,
    borderRadius: 12,
    width: "45%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
