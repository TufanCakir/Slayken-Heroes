import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Platform,
  Animated,
} from "react-native";
import Constants from "expo-constants";
import * as FileSystem from "expo-file-system";
import { Image as ExpoImage, ImageBackground } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import enemyImages from "../data/enemies.json";

const backgroundImageUrl =
  "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/images/images.png";

async function getCachedImage(uri) {
  const filename = uri.split("/").pop();
  const path = `${FileSystem.cacheDirectory}${filename}`;
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    try {
      await FileSystem.downloadAsync(uri, path);
      return path;
    } catch (err) {
      console.warn("❌ Fehler beim Caching:", uri);
      return uri;
    }
  }
  return path;
}

const animateProgress = (progressRef, toValue) => {
  return new Promise((resolve) => {
    Animated.timing(progressRef, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(() => resolve());
  });
};

export default function StartScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [cachedEnemyImage, setCachedEnemyImage] = useState(null);
  const [cachedBackground, setCachedBackground] = useState(null);

  const randomEnemyImage = useMemo(() => {
    const values = Object.values(enemyImages);
    const index = Math.floor(Math.random() * values.length);
    return values[index];
  }, []);

  useEffect(() => {
    getCachedImage(randomEnemyImage).then(setCachedEnemyImage);
    getCachedImage(backgroundImageUrl).then(setCachedBackground);
  }, [randomEnemyImage]);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);

    try {
      await animateProgress(progress, 0.2);
      await import("../data/backgrounds.json");

      await animateProgress(progress, 0.4);
      await import("../data/mapData.json");

      await animateProgress(progress, 0.6);
      await import("../data/songs.json");

      await animateProgress(progress, 0.8);
      await import("../data/enemies.json");

      await animateProgress(progress, 1.0);
      await import("../data/attackZone.json");

      navigation.replace("HomeScreen");
    } catch (error) {
      console.error("Fehler beim Vorladen:", error);
    }
  };

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const buildNumber =
    Platform.OS === "ios"
      ? Constants.expoConfig?.ios?.buildNumber ?? "1"
      : Constants.expoConfig?.android?.versionCode?.toString() ?? "1";

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.background}>
        <ImageBackground
          source={{ uri: cachedBackground || backgroundImageUrl }}
          style={styles.background}
          contentFit="cover"
          transition={1000}
        >
          <SafeAreaView style={styles.container}>
            {cachedEnemyImage && (
              <ExpoImage
                source={{ uri: cachedEnemyImage }}
                style={styles.enemyImage}
                contentFit="contain"
                transition={500}
              />
            )}

            <View style={styles.centerTextWrapper}>
              {loading ? (
                <View style={styles.progressBarWrapper}>
                  <Animated.View
                    style={[styles.progressBarFill, { width: progressWidth }]}
                  />
                </View>
              ) : (
                <Text style={styles.startText}>Berühren, um zu starten</Text>
              )}
            </View>

            <View style={styles.footer}>
              <ExpoImage
                source={require("../assets/logoT.png")}
                style={styles.logo}
                contentFit="contain"
              />
              <Text style={styles.copyright}>
                © {new Date().getFullYear()} Tufan Cakir
              </Text>
              <Text style={styles.version}>
                v{appVersion} (Build {buildNumber})
              </Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    justifyContent: "center",
    position: "relative",
  },
  enemyImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  centerTextWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  startText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  progressBarWrapper: {
    width: "100%",
    height: 16,
    borderRadius: 8,
    backgroundColor: "#333",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 30,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  copyright: {
    fontSize: 14,
    color: "#fff",
  },
  version: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
});
