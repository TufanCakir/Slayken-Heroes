// components/StaticCard.js
import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import CARD_THEMES from "../data/cardThemes.json";

export default function StaticCard({
  variant = "default",
  label,
  width = 100,
  height = 140,
}) {
  const scheme = CARD_THEMES[variant] || CARD_THEMES.default;

  return (
    <View
      style={[
        styles.card,
        {
          width,
          height,
          backgroundColor: scheme.frontBg,
          borderColor: scheme.borderColor,
        },
      ]}
    >
      <Text style={styles.text}>{label || variant}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
