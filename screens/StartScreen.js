import React, {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
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
import * as Updates from "expo-updates";
import { Image as ExpoImage, ImageBackground } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import enemyImages from "../data/enemies.json";
import backgrounds from "../data/backgrounds.json";
import mapData from "../data/mapData.json";
import songs from "../data/songs.json";
import enemies from "../data/enemies.json";
import attackZone from "../data/attackZone.json";

const BACKGROUND_IMAGE_URL =
  "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/images/images.png";

const dataModules = { backgrounds, mapData, songs, enemies, attackZone };

const getCachedImage = async (uri) => {
  const filename = uri.split("/").pop();
  const path = `${FileSystem.cacheDirectory}${filename}`;
  const info = await FileSystem.getInfoAsync(path);
  if (!info.exists) {
    try {
      await FileSystem.downloadAsync(uri, path);
      return path;
    } catch (err) {
      console.warn("❌ Fehler beim Caching:", uri, err);
      return uri;
    }
  }
  return path;
};

const animateProgress = (progressRef, toValue) =>
  new Promise((resolve) => {
    Animated.timing(progressRef, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start(resolve);
  });

export default function StartScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const [cachedEnemyImage, setCachedEnemyImage] = useState(null);
  const [cachedBackground, setCachedBackground] = useState(null);

  const randomEnemyImage = useMemo(() => {
    const values = Object.values(enemyImages);
    return values[Math.floor(Math.random() * values.length)];
  }, []);

  useEffect(() => {
    (async () => {
      const [enemyImage, backgroundImage] = await Promise.all([
        getCachedImage(randomEnemyImage),
        getCachedImage(BACKGROUND_IMAGE_URL),
      ]);
      setCachedEnemyImage(enemyImage);
      setCachedBackground(backgroundImage);
    })();
  }, [randomEnemyImage]);

  const handlePress = useCallback(async () => {
    if (loading || showUpdatePrompt) return;

    try {
      if (!Updates.isExpoGo) {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          setShowUpdatePrompt(true);
          return;
        }
      }
    } catch (e) {
      console.warn("Update-Check fehlgeschlagen:", e);
    }

    setLoading(true);
    const moduleKeys = Object.keys(dataModules);
    try {
      for (let i = 0; i < moduleKeys.length; i++) {
        await animateProgress(progress, (i + 1) / moduleKeys.length);
      }
      navigation.replace("HomeScreen");
    } catch (error) {
      console.error("Fehler beim Vorladen:", error);
      setLoading(false);
    }
  }, [loading, navigation, progress, showUpdatePrompt]);

  const startUpdate = async () => {
    try {
      await Updates.fetchUpdateAsync();
      Updates.reloadAsync();
    } catch (e) {
      console.warn("Fehler beim Update:", e);
      setShowUpdatePrompt(false);
    }
  };

  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const buildNumber =
    Platform.select({
      ios: Constants.expoConfig?.ios?.buildNumber ?? "1",
      android: Constants.expoConfig?.android?.versionCode?.toString() ?? "1",
    }) || "1";

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.background}>
        <ImageBackground
          source={{ uri: cachedBackground || BACKGROUND_IMAGE_URL }}
          style={styles.background}
          contentFit="cover"
          transition={1000}
        >
          <SafeAreaView style={styles.container}>
            {showUpdatePrompt ? (
              <View style={styles.centerTextWrapper}>
                <Text style={styles.startText}>🔄 Update verfügbar</Text>
                <Text style={styles.promptText}>Jetzt herunterladen?</Text>
                <Text style={styles.button} onPress={startUpdate}>
                  📥 Ja, Update jetzt
                </Text>
                <Text
                  style={[styles.button, { backgroundColor: "#666" }]}
                  onPress={() => setShowUpdatePrompt(false)}
                >
                  ❌ Später
                </Text>
              </View>
            ) : (
              <>
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
                        style={[
                          styles.progressBarFill,
                          { width: progressWidth },
                        ]}
                      />
                    </View>
                  ) : (
                    <Text style={styles.startText}>
                      Berühren, um zu starten
                    </Text>
                  )}
                </View>
              </>
            )}

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
  background: { flex: 1 },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    justifyContent: "center",
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
    marginBottom: 10,
  },
  promptText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#4caf50",
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
    marginVertical: 10,
    overflow: "hidden",
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
