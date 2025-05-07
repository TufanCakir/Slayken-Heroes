import React from "react";
import { StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

import { GameProvider } from "./context/GameContext";
import { useGame } from "./hooks/useGame";
import { useMusicManager } from "./hooks/useMusicManager";

import { UILoaderProvider } from "./context/UILoaderProvider";
import UILoaderOverlay from "./components/UILoaderOverlay";

import AppNavigator from "./navigation/AppNavigator";
import OnlineGuard from "./components/OnlineGuard";

function InnerApp() {
  const { musicOn } = useGame();
  useMusicManager(musicOn);

  return (
    <OnlineGuard>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </OnlineGuard>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <UILoaderProvider>
          <GameProvider>
            <UILoaderOverlay />
            <InnerApp />
          </GameProvider>
        </UILoaderProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
});
