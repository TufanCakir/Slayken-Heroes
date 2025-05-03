import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import * as StoreReview from "expo-store-review";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useGame } from "../hooks/useGame";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Footer from "../components/Footer";
import Header from "../components/Header";
import mapData from "../data/mapData.json";
import backgrounds from "../data/backgrounds.json";
import TutorialOverlay from "../components/TutorialOverlay";
import styles from "../styles/HomeScreenStyles";
import { getCachedImage } from "../utils/ImageCache";

const REWARD_COLLECTED_KEY = "REWARD_COLLECTED";
const REVIEW_REQUESTED_KEY = "REVIEW_REQUESTED";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { deck, summons, isFightCompleted, grantDailyLoginBonus } = useGame();

  const [selectedIsland, setSelectedIsland] = useState(null);
  const [rewardCollected, setRewardCollected] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [mapIslands, setMapIslands] = useState([]);
  const [cachedHomeMapImage, setCachedHomeMapImage] = useState(null);

  const homeMap = backgrounds.find((map) => map.name === "home");
  useEffect(() => {
    if (homeMap?.image) {
      getCachedImage(homeMap.image).then(setCachedHomeMapImage);
    }
  }, [homeMap]);

  useEffect(() => {
    const fetchRewardStatus = async () => {
      const status = await AsyncStorage.getItem(REWARD_COLLECTED_KEY);
      setRewardCollected(status === "true");
    };
    fetchRewardStatus();
  }, []);

  const checkAndRequestReview = async () => {
    try {
      const alreadyRequested = await AsyncStorage.getItem(REVIEW_REQUESTED_KEY);
      if (alreadyRequested === "true") return;

      const allLevelsCompleted = mapData.every((island) =>
        island.fights.every((fight) => isFightCompleted(island.id, fight.id))
      );

      if (allLevelsCompleted && (await StoreReview.hasAction())) {
        await StoreReview.requestReview();
        await AsyncStorage.setItem(REVIEW_REQUESTED_KEY, "true");
      }
    } catch (err) {
      console.warn("Fehler bei Review-Anfrage:", err);
    }
  };

  useEffect(() => {
    const updateMapWithProgress = () => {
      const updatedIslands = mapData.map((island) => {
        const updatedFights = island.fights.map((fight) => ({
          ...fight,
          unlocked: isFightCompleted(island.id, fight.id) || fight.unlocked,
        }));
        const islandUnlocked = updatedFights.some((fight) => fight.unlocked);
        return {
          ...island,
          fights: updatedFights,
          unlocked: islandUnlocked,
        };
      });

      for (let i = 0; i < updatedIslands.length - 1; i++) {
        const current = updatedIslands[i];
        const next = updatedIslands[i + 1];
        const allDone = current.fights.every((f) =>
          isFightCompleted(current.id, f.id)
        );
        if (allDone) {
          next.unlocked = true;
          next.fights = next.fights.map((f) => ({ ...f, unlocked: true }));
        }
      }

      setMapIslands(updatedIslands);
      checkAndRequestReview();
    };

    updateMapWithProgress();
  }, [isFightCompleted]);

  const allRequirementsMet =
    rewardCollected && summons.length > 0 && deck.length > 0;

  const onSelectIsland = (island) => {
    if (island.unlocked) setSelectedIsland(island);
  };

  const handleScreenPress = () => setSelectedIsland(null);

  const renderFightOverlay = () => {
    if (!selectedIsland) return null;
    return (
      <View style={styles.fightOverlay}>
        <Text style={styles.fightTitle}>Level {selectedIsland.id}</Text>
        {selectedIsland.fights.slice(0, 1).map((fight) => (
          <TouchableOpacity
            key={fight.id}
            style={[
              styles.fightButton,
              {
                backgroundColor:
                  fight.unlocked && allRequirementsMet ? "#29a9ff" : "#555",
              },
            ]}
            disabled={!fight.unlocked || !allRequirementsMet}
            onPress={() =>
              navigation.navigate("BattleScreen", {
                islandId: selectedIsland.id,
                fightId: fight.id,
              })
            }
          >
            <Text style={styles.fightText}>
              {fight.name}
              {!allRequirementsMet ? " (gesperrt)" : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.container}>
        <TutorialOverlay
          visible={tutorialVisible}
          onComplete={() => setTutorialVisible(false)}
        />

        {cachedHomeMapImage && (
          <Image
            source={{ uri: cachedHomeMapImage }}
            style={[styles.background, StyleSheet.absoluteFillObject]}
            contentFit="cover"
          />
        )}

        <Header />

        <TouchableOpacity
          style={styles.newsButton}
          onPress={() => navigation.navigate("NewsScreen")}
        >
          <Text style={styles.newsButtonText}>News</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.eventButton}
          onPress={() => navigation.navigate("EventScreen")}
        >
          <Text style={styles.eventButtonText}>Event</Text>
        </TouchableOpacity>

        <View style={styles.islandLayer}>
          {mapIslands.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.islandWrapper, { top: item.y, left: item.x }]}
              onPress={() => onSelectIsland(item)}
              disabled={!item.unlocked}
              activeOpacity={0.8}
            >
              <Image
                source={item.image}
                style={styles.island}
                contentFit="contain"
              />
              <View
                style={[
                  styles.levelButton,
                  item.unlocked ? styles.unlocked : styles.locked,
                ]}
              >
                <Text style={styles.levelText}>
                  {item.unlocked ? item.id : "\ud83d\udd12"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {renderFightOverlay()}

        <View style={styles.footerWrapper}>
          <View style={styles.levelBar}>
            {mapIslands.map((island) => {
              const allDone = island.fights.every((fight) =>
                isFightCompleted(island.id, fight.id)
              );
              return (
                <View key={island.id} style={styles.levelCircleWrapper}>
                  <Text
                    style={[
                      styles.levelCircle,
                      allDone ? styles.levelDone : styles.levelLocked,
                    ]}
                  >
                    {allDone ? "\u2713" : island.id}
                  </Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            style={styles.rewardButton}
            onPress={() => navigation.navigate("RewardScreen")}
          >
            <Text style={styles.rewardButtonText}>GiftBox</Text>
          </TouchableOpacity>

          <Footer />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
