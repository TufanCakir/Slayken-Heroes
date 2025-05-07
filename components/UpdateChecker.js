import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as Updates from "expo-updates";

const UpdateChecker = ({ showStatus = true, onComplete = null }) => {
  const [status, setStatus] = useState('checking');

  const checkForUpdates = useCallback(async () => {
    try {
      if (Updates.isExpoGo) {
        setStatus('current');
        onComplete?.(false);
        return;
      }

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        setStatus('updated');
        setTimeout(Updates.reloadAsync, 1200);
      } else {
        setStatus('current');
        onComplete?.(false);
      }
    } catch (e) {
      console.warn("❌ Fehler bei Update-Check:", e);
      setStatus('error');
      onComplete?.(false);
    }
  }, [onComplete]);

  useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  if (!showStatus) return null;

  const statusMessages = {
    checking: { icon: '🔍', text: 'Suche nach Updates...' },
    updated: { icon: '🔄', text: 'Update geladen – Neustart...' },
    error: { icon: '⚠️', text: 'Fehler beim Update' },
    current: { icon: '✅', text: 'App ist aktuell' },
  };

  const { icon, text } = statusMessages[status];

  return (
    <View style={styles.container}>
      {status === 'checking' && <ActivityIndicator size="small" color="#4caf50" />}
      <Text style={styles.text}>{icon} {text}</Text>
      <Text style={styles.version}>
        runtimeVersion: {Updates.runtimeVersion}
      </Text>
    </View>
  );
};

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

export default UpdateChecker;