import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as Updates from "expo-updates";

export default function UpdateChecker({
  showStatus = true,
  onComplete = null,
}) {
  const [checking, setChecking] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkForUpdates = async () => {
      try {
        if (Updates.isExpoGo) {
          setChecking(false);
          onComplete?.(false); // kein Update
          return;
        }

        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          setUpdated(true);

          setTimeout(() => {
            Updates.reloadAsync(); // App neustarten
          }, 1200);
        } else {
          setChecking(false);
          onComplete?.(false);
        }
      } catch (e) {
        console.warn("❌ Fehler bei Update-Check:", e);
        setError(e);
        setChecking(false);
        onComplete?.(false);
      }
    };

    checkForUpdates();
  }, []);

  if (!showStatus) return null;

  return (
    <View style={styles.container}>
      {checking && (
        <>
          <ActivityIndicator size="small" color="#4caf50" />
          <Text style={styles.text}>Suche nach Updates...</Text>
        </>
      )}
      {updated && (
        <Text style={styles.text}>🔄 Update geladen – Neustart...</Text>
      )}
      {error && <Text style={styles.text}>⚠️ Fehler beim Update</Text>}
      {!checking && !updated && !error && (
        <Text style={styles.text}>✅ App ist aktuell</Text>
      )}
      <Text style={styles.version}>
        runtimeVersion: {Updates.runtimeVersion}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 10,
    minWidth: 200,
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 14,
    marginTop: 6,
    textAlign: "center",
  },
  version: {
    color: "#ccc",
    fontSize: 10,
    marginTop: 4,
  },
});
