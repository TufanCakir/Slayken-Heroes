import React, { useEffect, useCallback, useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import UpdateChecker from "./components/UpdateChecker";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GameProvider } from "./context/GameContext";
import { useGame } from "./hooks/useGame";
import { useMusicManager } from "./hooks/useMusicManager";
import AppNavigator from "./navigation/AppNavigator";
import OnlineGuard from "./components/OnlineGuard";

import enemyImages from "./data/enemies.json";
import backgrounds from "./data/backgrounds.json";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [cachedImages, setCachedImages] = useState({});

  useEffect(() => {
    async function prepare() {
      try {
        const delay = new Promise((res) => setTimeout(res, 1000));

        const dataLoading = Promise.all([
          import("./data/mapData.json"),
          import("./data/songs.json"),
          import("./data/enemies.json"),
          import("./data/attackZone.json"),
        ]);

        const assetLoading = Asset.loadAsync([
          require("./assets/logoT.png"),
          require("./assets/splash.png"),
        ]);

        // Lokale Cache-Funktion für Remote-Bilder
        const downloadAndCacheImage = async (url) => {
          try {
            const filename = url.split("/").pop();
            const localPath = `${FileSystem.cacheDirectory}${filename}`;
            const info = await FileSystem.getInfoAsync(localPath);

            if (!info.exists) {
              await FileSystem.downloadAsync(url, localPath);
              console.log("📥 Bild gespeichert:", filename);
            } else {
              console.log("✅ Bereits lokal:", filename);
            }

            return localPath;
          } catch (err) {
            console.warn("❌ Fehler beim Bild-Download:", url, err);
            return url;
          }
        };

        const enemyImageUrls = Object.values(enemyImages);
        const backgroundUrls = backgrounds
          .map((bg) => bg.image)
          .filter((url) => typeof url === "string");

        const allRemoteUrls = [...enemyImageUrls, ...backgroundUrls];
        await Promise.all(allRemoteUrls.map(downloadAndCacheImage));

        await Promise.all([delay, dataLoading, assetLoading]);
      } catch (error) {
        console.warn("⚠️ Fehler beim Vorbereiten der App:", error);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={styles.splashContainer}>
        <ActivityIndicator size="large" color="#003b5a" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} onLayout={onLayoutRootView}>
        <GameProvider cachedImages={cachedImages}>
          <InnerApp />
        </GameProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function InnerApp() {
  const { musicOn } = useGame();
  useMusicManager(musicOn);

  return (
    <>
      <OnlineGuard>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
        <UpdateChecker />
      </OnlineGuard>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
});
