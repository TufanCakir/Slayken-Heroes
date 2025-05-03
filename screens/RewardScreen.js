import React, { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { ImageBackground } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGame } from "../hooks/useGame";
import RewardPopup from "../components/RewardPopup";
import { rewardScreenStyles as styles } from "../styles/RewardScreenStyles";
import Footer from "../components/Footer";
import { useNavigation } from "@react-navigation/native";
import attackZone from "../data/attackZone.json";

const RewardScreen = ({ route }) => {
  const navigation = useNavigation();
  const { addCoins, addCrystals } = useGame();
  const [rewards, setRewards] = useState({ coins: 0, crystals: 0 });
  const [loading, setLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const claimed = await AsyncStorage.getItem("REWARD_COLLECTED");
        if (claimed === "true") {
          setAlreadyClaimed(true);
        }

        if (route?.params?.rewards) {
          setRewards(route.params.rewards);
        } else {
          const storedRewards = await AsyncStorage.getItem("REWARD_DATA");
          if (storedRewards) {
            setRewards(JSON.parse(storedRewards));
          } else {
            setRewards({ coins: 500, crystals: 50 });
          }
        }
      } catch (error) {
        console.error("Fehler beim Laden der Belohnung:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRewards();
  }, [route]);

  const claimRewards = async () => {
    if (alreadyClaimed) return;

    addCoins(rewards.coins);
    addCrystals(rewards.crystals);
    setShowPopup(true);

    await AsyncStorage.setItem("REWARD_COLLECTED", "true");
    await AsyncStorage.removeItem("REWARD_DATA");

    setAlreadyClaimed(true);

    setTimeout(() => {
      navigation.goBack();
    }, 2000);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground source={attackZone.image} style={styles.backgroundImage}>
        {/* 🎯 Zeige NUR an, wenn noch nicht abgeholt */}
        {!alreadyClaimed && (
          <>
            <Text style={styles.title}>Belohnung abholen!</Text>

            <Text style={styles.rewardText}>
              Erhalte {rewards.coins} Coins und {rewards.crystals} Crystals!
            </Text>

            <View style={styles.button}>
              <Button title="Belohnung einsammeln" onPress={claimRewards} />
            </View>
          </>
        )}

        <RewardPopup
          visible={showPopup}
          onClose={() => setShowPopup(false)}
          rewards={rewards}
        />

        {/* Footer bleibt immer */}
        <View style={styles.footerWrapper}>
          <Footer />
        </View>
      </ImageBackground>
    </View>
  );
};

export default RewardScreen;
