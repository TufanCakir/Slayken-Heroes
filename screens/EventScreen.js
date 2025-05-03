import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  SafeAreaView,
  View,
  Text,
  Animated,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image, ImageBackground } from "expo-image";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useEvent } from "../hooks/useEvent";
import { useGame } from "../hooks/useGame";
import FlipCard from "../components/FlipCard";
import Footer from "../components/Footer";
import { EventScreenStyles as styles } from "../styles/EventScreenStyles";
import { getImageSource } from "../utils/getImageSource";
import attackZone from "../data/attackZone.json";
import { allEventData } from "../data/events";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = 20;

export default function EventScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { deck } = useGame();
  const { eventId, fightId } = route.params || {};

  const battlefieldScale = useRef(new Animated.Value(1)).current;
  const [gameOver, setGameOver] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [enemyImageUris, setEnemyImageUris] = useState([]);
  const hasWonRef = useRef(false); // 👈 NEU

  const events = useMemo(() => Object.entries(allEventData), []);
  const showSelection = !eventId || !allEventData[eventId]?.fights;

  const onSelectEvent = useCallback(
    (key) => {
      navigation.replace("EventScreen", { eventId: key, fightId: 1 });
    },
    [navigation]
  );

  if (showSelection) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={{ uri: attackZone.image }}
          style={[styles.background, { flex: 1 }]}
          contentFit="cover"
        >
          <Text style={styles.eventName}>Wähle ein Event</Text>

          <View style={styles.eventList}>
            {events.map(([key, event]) => (
              <TouchableOpacity
                key={key}
                style={styles.eventButton}
                onPress={() => onSelectEvent(key)}
              >
                <Text style={styles.eventButtonText}>{event.name || key}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.footerWrapper}>
            <Footer />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  const currentEvent = allEventData[eventId];
  const currentFight = currentEvent?.fights?.[fightId];

  if (!currentFight) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>❌ Fehler: Ungültiges Event.</Text>
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
  } = useEvent(
    currentFight.enemies,
    deck,
    ({ exp, coins, crystals }) => {
      if (!hasWonRef.current) {
        hasWonRef.current = true;
        navigation.replace("ResultEventScreen", {
          expGained: exp,
          coinsGained: coins,
          crystalsGained: crystals,
          eventId,
          fightId,
        });
      }
    },
    eventId,
    fightId
  );

  // 👇 Triggern von Animation bei jeder neuen Runde
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

  // 👇 Game Over Behandlung
  useEffect(() => {
    if (playerHp <= 0) {
      setGameOver(true);
      setTimeout(() => {
        navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
      }, 2000);
    }
  }, [playerHp]);

  // 👇 Gegner-Bilder und Hintergrund laden
  useEffect(() => {
    (async () => {
      const bg = await getImageSource(currentFight.background);
      setBackgroundImage(bg);
      const uris = await Promise.all(
        enemies.map((enemy) => getImageSource(enemy.image))
      );
      setEnemyImageUris(uris);
    })();
  }, [currentFight.background, enemies]);

  // 👇 Falls useEvent keinen Victory-Callback gibt:
  useEffect(() => {
    if (!hasWonRef.current && enemies.length > 0) {
      const allDead = enemies.every((e) => e.hp <= 0);
      if (allDead) {
        hasWonRef.current = true;
        setTimeout(() => {
          navigation.replace("ResultEventScreen", {
            expGained: currentEvent.rewards?.exp || 0,
            coinsGained: currentEvent.rewards?.coins || 0,
            crystalsGained: currentEvent.rewards?.crystals || 0,
            eventId,
            fightId,
          });
        }, 1000);
      }
    }
  }, [enemies]);

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
