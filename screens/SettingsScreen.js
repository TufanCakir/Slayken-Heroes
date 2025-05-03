import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Updates from "expo-updates";
import { ImageBackground } from "expo-image";
import { useGame } from "../hooks/useGame";
import Footer from "../components/Footer";
import Slider from "@react-native-community/slider";
import attackZone from "../data/attackZone.json";

const { width, height } = Dimensions.get("window");

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { musicOn, toggleMusic, volume, dispatch } = useGame();

  const handleVolumeChange = (value) => {
    dispatch({ type: "SET_VOLUME", volume: value }); // 🎯 Dispatch im Context
  };

  const handleClearStorage = () => {
    Alert.alert(
      "Spieldaten löschen",
      "Möchtest du alle gespeicherten Spieldaten löschen und die App neu starten?",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              await Updates.reloadAsync();
            } catch (e) {
              console.error("Fehler beim Löschen der Daten", e);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={attackZone.image} style={styles.backgroundImage}>
        {/* Musik-Schalter */}
        <View style={styles.row}>
          <Text style={styles.label}>Musik</Text>
          <Switch
            value={musicOn}
            onValueChange={toggleMusic}
            thumbColor={musicOn ? "#f5dd4b" : "#767577"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
          />
        </View>

        {/* 🎚️ Lautstärke-Slider */}
        <View style={styles.sliderContainer}>
          <Text style={styles.label}>Lautstärke</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={volume}
            onValueChange={handleVolumeChange} // ✅ jetzt korrekt
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#1fb28a"
          />
        </View>
        <TouchableOpacity
          style={styles.tosButton}
          onPress={() => navigation.navigate("TosScreen")}
        >
          <Text style={styles.tosText}>Nutzungsbedingungen</Text>
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleClearStorage}
        >
          <Text style={styles.resetText}>Reset game data</Text>
        </TouchableOpacity>

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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginTop: 30,
  },
  sliderContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  label: {
    color: "#fff",
    fontSize: 18,
  },
  resetButton: {
    marginTop: "auto",
    backgroundColor: "#003b5a",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    bottom: 100,
  },
  resetText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  tosButton: {
    marginTop: "auto",
    backgroundColor: "#003b5a",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    bottom: 100,
  },
  tosText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
