import React, { useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Image, ImageBackground } from "expo-image";
import { useNavigation, useRoute } from "@react-navigation/native";
import FlipCard from "../components/FlipCard";
import { useBattle } from "../hooks/useBattle";
import { useGame } from "../hooks/useGame";
import { BattleScreenStyles as styles } from "../styles/BattleScreenStyles";
import { getImageSource } from "../utils/getImageSource";
import { allBattleData } from "../data/islands";
import attackZone from "../data/attackZone.json";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 20;

export default function BattleScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { deck, completeFight } = useGame();
  const { islandId, fightId } = route.params || {};

  const battlefieldScale = useRef(new Animated.Value(1)).current;
  const [gameOver, setGameOver] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [enemyImageUris, setEnemyImageUris] = useState([]);

  const currentIslandData = allBattleData[islandId];
  const currentFightData = currentIslandData?.fights?.[fightId];

  if (!currentIslandData || !currentFightData) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>❌ Fehler: Ungültiger Kampf.</Text>
      </SafeAreaView>
    );
  }

  const {
    cards: battleCards,
    enemies,
    beams,
    onFlipComplete,
    enemyRefs,
    playerHp,
    playerMaxHp,
    currentRound,
  } = useBattle(
    currentFightData.enemies || [],
    deck,
    ({ exp, coins, crystals }) => {
      completeFight(islandId, fightId);
      navigation.replace("ResultScreen", {
        expGained: exp,
        coinsGained: coins,
        crystalsGained: crystals,
        islandId,
        fightId,
      });
    },
    islandId,
    fightId
  );

  useEffect(() => {
    Animated.sequence([
      Animated.timing(battlefieldScale, {
        toValue: 1.1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(battlefieldScale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentRound]);

  useEffect(() => {
    if (playerHp <= 0) {
      setGameOver(true);
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
      }, 2000);
    }
  }, [playerHp]);

  useEffect(() => {
    (async () => {
      const bg = await getImageSource(currentFightData.background);
      setBackgroundImage(bg);
      const uris = await Promise.all(
        enemies.map((enemy) => getImageSource(enemy.image))
      );
      setEnemyImageUris(uris);
    })();
  }, [currentFightData.background, enemies]);

  const attackCards = battleCards.slice(0, 5);
  const count = attackCards.length || 1;
  const totalMargins = (count - 1) * 24;
  const availableWidth = SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - totalMargins;
  const CARD_WIDTH = availableWidth / count;
  const CARD_HEIGHT = CARD_WIDTH * 1.4;

  return (
    <SafeAreaView style={styles.container}>
      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.gameOverText}>GAME OVER</Text>
        </View>
      )}

      <Animated.View
        style={[
          styles.fullBattlefield,
          { transform: [{ scale: battlefieldScale }] },
        ]}
      >
        {backgroundImage && (
          <ImageBackground
            source={backgroundImage}
            style={StyleSheet.absoluteFill}
            imageStyle={styles.fullBattlefieldImage}
            contentFit="cover"
            transition={500}
            placeholder="blur"
            backgroundColor="#000"
          >
            <View style={styles.enemyOverlay}>
              {enemies.map((enemy, index) => (
                <View
                  key={enemy.id}
                  style={styles.enemy}
                  ref={enemyRefs[index]}
                >
                  <View style={styles.hpBarBackground}>
                    <View
                      style={[
                        styles.hpBarFill,
                        { width: `${(enemy.hp / enemy.maxHp) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.enemyName}>{enemy.name}</Text>
                  {enemyImageUris[index] && (
                    <Image
                      source={enemyImageUris[index]}
                      style={styles.enemyImage}
                      contentFit="contain"
                      transition={300}
                      placeholder="blur"
                      backgroundColor="#111"
                    />
                  )}
                </View>
              ))}
            </View>
          </ImageBackground>
        )}
      </Animated.View>

      <View style={styles.attackZone}>
        <Image
          source={{ uri: attackZone.image }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={300}
          placeholder="blur"
          backgroundColor="#000"
        />

        <View style={styles.roundWrapper}>
          <Text style={styles.roundText}>ROUND {currentRound}</Text>
        </View>

        <View style={styles.playerHpWrapper}>
          <View style={styles.hpBarBackground}>
            <View
              style={[
                styles.hpBarFill,
                {
                  width: `${(playerHp / playerMaxHp) * 100}%`,
                  backgroundColor: "lime",
                },
              ]}
            />
          </View>
          <Text style={styles.playerHpText}>
            {playerHp} / {playerMaxHp} HP
          </Text>
        </View>

        <Text style={styles.attackZoneLabel}>ATTACK ZONE</Text>

        <View style={styles.attackCards}>
          {attackCards.map((card, i) => (
            <View
              key={card.id}
              style={[
                styles.attackCardWrapper,
                { width: CARD_WIDTH, height: CARD_HEIGHT },
              ]}
            >
              <FlipCard
                width={CARD_WIDTH}
                height={CARD_HEIGHT}
                variant={card.variant}
                frontContent={
                  <View style={styles.cardContent}>
                    <Text style={styles.cardNumber}>{card.damage}</Text>
                    <Text style={styles.cardLabel}>
                      {card.variant.toUpperCase()}
                    </Text>
                  </View>
                }
                backContent={<Text style={styles.cardBackContent}>BACK</Text>}
                onFlipComplete={(layout) => onFlipComplete(card, layout, i)}
              />
            </View>
          ))}
        </View>
      </View>

      {beams.map(({ id, anim, fromX, fromY, toX, toY, color }) => {
        const translateX = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [fromX, toX],
        });
        const translateY = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [fromY, toY],
        });
        return (
          <Animated.View
            key={id}
            style={[
              styles.beam,
              {
                backgroundColor: color,
                transform: [{ translateX }, { translateY }, { scale: anim }],
              },
            ]}
          />
        );
      })}
    </SafeAreaView>
  );
}
