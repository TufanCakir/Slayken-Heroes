import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as Updates from "expo-updates";

export default function UpdateChecker() {
  const [checking, setChecking] = useState(true);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        if (Updates.isExpoGo) {
          // ⚠️ Nicht prüfen in Expo Go!
          setChecking(false);
          return;
        }

        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setUpdated(true);

          // Kurze Info anzeigen, dann App neu laden
          setTimeout(() => {
            Updates.reloadAsync();
          }, 1500);
        } else {
          setChecking(false);
        }
      } catch (error) {
        console.warn("❌ Fehler bei Update-Check:", error);
        setChecking(false);
      }
    };

    checkForUpdates();
  }, []);

  if (checking) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#4caf50" />
        <Text style={styles.text}>Suche nach Updates...</Text>
      </View>
    );
  }

  if (updated) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>🔄 Update geladen – Neustart...</Text>
      </View>
    );
  }

  return null; // Kein Update nötig – Komponente bleibt unsichtbar
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
});
