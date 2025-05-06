import React from "react";
import { View, Text, StyleSheet } from "react-native";
import useOnlineStatus from "../hooks/useOnlineStatus";

export default function OnlineGuard({ children }) {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return (
      <View style={styles.centered}>
        <Text style={styles.text}>
          Bitte aktiviere deine Internetverbindung
        </Text>
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "white",
    fontSize: 16,
    padding: 20,
    textAlign: "center",
  },
});
