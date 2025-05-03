// screens/DeckScreen.js
import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { useGame } from "../hooks/useGame";
import StaticCard from "../components/StaticCard";
import Footer from "../components/Footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ImageBackground } from "expo-image";
import attackZone from "../data/attackZone.json";

const { width, height } = Dimensions.get("window");

const DECK_KEY = "deck";

export default function DeckScreen() {
  const { deck, summons, addToDeck, removeFromDeck, clearDeck } = useGame();

  // Persist deck to AsyncStorage whenever it changes
  useEffect(() => {
    const storeDeck = async () => {
      try {
        await AsyncStorage.setItem(DECK_KEY, JSON.stringify(deck));
      } catch (e) {
        console.error("Fehler beim Speichern des Decks:", e);
      }
    };
    storeDeck();
  }, [deck]);

  const isInDeck = (card) => deck.includes(card);

  return (
    <View style={styles.container}>
      <ImageBackground source={attackZone.image} style={styles.backgroundImage}>
        <Text style={styles.title}>Dein Deck ({deck.length} Karten)</Text>

        {/* Summons Auswahl */}
        <Text style={styles.subtitle}>Verfügbare Karten:</Text>
        {summons.length === 0 ? (
          <Text style={styles.emptyText}>Keine Summons verfügbar! 🚀</Text>
        ) : (
          <FlatList
            data={summons}
            keyExtractor={(item, idx) => `${item}-${idx}`}
            numColumns={3}
            contentContainerStyle={styles.deckList}
            renderItem={({ item }) => {
              const disabled = isInDeck(item);
              return (
                <TouchableOpacity
                  style={{ opacity: disabled ? 0.4 : 1 }}
                  onPress={() => !disabled && addToDeck(item)}
                  disabled={disabled}
                >
                  <StaticCard
                    variant={item}
                    label={item}
                    width={100}
                    height={140}
                  />
                </TouchableOpacity>
              );
            }}
          />
        )}

        {/* Aktuelles Deck */}
        <Text style={styles.subtitle}>Aktuelles Deck:</Text>
        {deck.length === 0 ? (
          <Text style={styles.emptyText}>Noch nichts im Deck!</Text>
        ) : (
          <FlatList
            data={deck}
            keyExtractor={(item, idx) => `${item}-${idx}`}
            numColumns={3}
            contentContainerStyle={styles.deckList}
            renderItem={({ item, index }) => (
              <TouchableOpacity onPress={() => removeFromDeck(index)}>
                <StaticCard
                  variant={item}
                  label={item}
                  width={100}
                  height={140}
                />
              </TouchableOpacity>
            )}
          />
        )}

        {/* Deck Clear Button */}
        <TouchableOpacity style={styles.clearButton} onPress={clearDeck}>
          <Text style={styles.clearButtonText}>Deck Leeren</Text>
        </TouchableOpacity>

        {/* Footer */}
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
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    color: "#00d2ff",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    color: "#00D2FF",
    fontWeight: "bold",
    marginVertical: 10,
  },
  emptyText: {
    color: "#aaa",
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
  deckList: {
    justifyContent: "center",
  },
  clearButton: {
    backgroundColor: "#003b5a",
    padding: 30,
    borderRadius: 12,
    marginHorizontal: 30,
    marginVertical: 20,
    marginBottom: 100,
  },
  clearButtonText: {
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
