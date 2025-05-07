import React, { useEffect, useCallback, useState, Suspense } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import * as SplashScreen from "expo-splash-screen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GameProvider } from "./context/GameContext";
import { useGame } from "./hooks/useGame";
import { useMusicManager } from "./hooks/useMusicManager";
import StartupUpdater from "./components/StartupUpdater";

import enemyImages from "./data/enemies.json";
import backgrounds from "./data/backgrounds.json";

const LazyAppNavigator = React.lazy(() => import("./navigation/AppNavigator"));
const LazyOnlineGuard = React.lazy(() => import("./components/OnlineGuard"));

SplashScreen.preventAutoHideAsync();

const downloadAndCacheImage = async (url) => {
  try {
    const filename = url.split("/").pop();
    const localPath = `${FileSystem.cacheDirectory}${filename}`;
    const info = await FileSystem.getInfoAsync(localPath);

    if (!info.exists) {
      await FileSystem.downloadAsync(url, localPath);
    }

    return localPath;
  } catch (err) {
    console.warn("❌ Fehler beim Bild-Download:", url, err);
    return url;
  }
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [appStep, setAppStep] = useState("startup");
  const [cachedImages, setCachedImages] = useState({});

  useEffect(() => {
    async function prepare() {
      try {
        const criticalAssets = [
          import("./data/mapData.json"),
          import("./data/songs.json"),
          Asset.loadAsync([require("./assets/logoT.png")]),
        ];

        const enemyImageUrls = Object.values(enemyImages);
        const backgroundUrls = backgrounds
          .map((bg) => bg.image)
          .filter((url) => typeof url === "string");

        const criticalImageUrls = [...enemyImageUrls, ...backgroundUrls].slice(0, 5);

        await Promise.all([
          ...criticalAssets,
          ...criticalImageUrls.map(downloadAndCacheImage),
        ]);

        // Load non-critical assets in the background
        setTimeout(() => {
          const nonCriticalImageUrls = [...enemyImageUrls, ...backgroundUrls].slice(5);
          Promise.all(nonCriticalImageUrls.map(downloadAndCacheImage)).then(
            (cachedPaths) => {
              setCachedImages((prev) => ({
                ...prev,
                ...Object.fromEntries(
                  nonCriticalImageUrls.map((url, i) => [url, cachedPaths[i]])
                ),
              }));
            }
          );
        }, 0);
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

  const InnerApp = useCallback(() => {
    const { musicOn } = useGame();
    useMusicManager(musicOn);

    if (appStep === "startup") {
      return <StartupUpdater onFinish={() => setAppStep("ready")} />;
    }

    if (appStep === "ready") {
      return (
        <Suspense fallback={<ActivityIndicator size="large" color="#003b5a" />}>
          <LazyOnlineGuard>
            <NavigationContainer>
              <LazyAppNavigator />
            </NavigationContainer>
          </LazyOnlineGuard>
        </Suspense>
      );
    }

    return null;
  }, [appStep]);

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
          <Suspense fallback={<ActivityIndicator size="large" color="#003b5a" />}>
            <InnerApp />
          </Suspense>
        </GameProvider>
      </SafeAreaView>
    </SafeAreaProvider>
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
