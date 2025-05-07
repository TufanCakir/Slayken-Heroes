import React from "react";
import { View, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { useUILoader } from "../context/UILoaderProvider";

const { width, height } = Dimensions.get("window");

export default function UILoaderOverlay() {
  const { isVisible } = useUILoader();

  if (!isVisible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.box}>
        <ActivityIndicator size="large" color="#29a9ff" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  box: {
    padding: 24,
    backgroundColor: "#111",
    borderRadius: 16,
  },
});
