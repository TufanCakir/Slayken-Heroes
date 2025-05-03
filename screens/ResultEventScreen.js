import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ImageBackground } from "expo-image";
import { useGame } from "../hooks/useGame";
import attackZone from "../data/attackZone.json";

const { width, height } = Dimensions.get("window");

export default function ResultEventScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    expGained = 0,
    coinsGained = 0,
    crystalsGained = 0,
  } = route.params || {};

  const { coins, crystals, level, xp, addCoins, addCrystals, addXP } =
    useGame();

  const [displayCoins, setDisplayCoins] = useState(coins);
  const [displayLevel, setDisplayLevel] = useState(level);
  const [displayCrystals, setDisplayCrystals] = useState(crystals);

  const coinsAnim = useRef(new Animated.Value(coins)).current;
  const levelAnim = useRef(new Animated.Value(level)).current;
  const crystalsAnim = useRef(new Animated.Value(crystals)).current;

  useEffect(() => {
    // Aktualisiere echten GameState
    addCoins(coinsGained);
    addCrystals(crystalsGained);
    addXP(expGained);

    const newCoins = coins + coinsGained;
    const newCrystals = crystals + crystalsGained;
    const gainedLevels = Math.floor((xp + expGained) / 100);
    const newLevel = level + gainedLevels;

    Animated.parallel([
      Animated.timing(coinsAnim, {
        toValue: newCoins,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(levelAnim, {
        toValue: newLevel,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(crystalsAnim, {
        toValue: newCrystals,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();

    const coinListener = coinsAnim.addListener(({ value }) =>
      setDisplayCoins(Math.floor(value))
    );
    const levelListener = levelAnim.addListener(({ value }) =>
      setDisplayLevel(Math.floor(value))
    );
    const crystalListener = crystalsAnim.addListener(({ value }) =>
      setDisplayCrystals(Math.floor(value))
    );

    return () => {
      coinsAnim.removeListener(coinListener);
      levelAnim.removeListener(levelListener);
      crystalsAnim.removeListener(crystalListener);
    };
  }, [coinsGained, crystalsGained, expGained]);

  return (
    <View style={styles.container}>
      <ImageBackground source={attackZone.image} style={styles.backgroundImage}>
        <Text style={styles.title}>Event abgeschlossen!</Text>

        <View style={styles.statRow}>
          <Text style={styles.label}>Coins:</Text>
          <Text style={styles.value}>{displayCoins}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.label}>Level:</Text>
          <Text style={styles.value}>{displayLevel}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.label}>Crystals:</Text>
          <Text style={styles.value}>{displayCrystals}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Nochmal Event spielen"
            onPress={() =>
              navigation.replace("EventScreen", {
                eventId: route.params?.eventId,
                fightId: route.params?.fightId,
              })
            }
          />
          <Button
            title="Zurück zu Home"
            onPress={() => navigation.navigate("HomeScreen")}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Fallback falls das Bild nicht lädt
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffd700",
    textAlign: "center",
    marginBottom: 30,
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  statRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  label: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "500",
  },
  value: {
    fontSize: 20,
    color: "#00d2ff",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 40,
  },
});
