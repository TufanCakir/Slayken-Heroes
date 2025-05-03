import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useIsFocused } from "@react-navigation/native";

const TUTORIAL_DONE_KEY = "TUTORIAL_DONE";
const tutorialSteps = [
  {
    message: "Willkommen! 👋 Hol dir zuerst deine Belohnung ab!",
    screen: "RewardScreen",
    // REST API: Ensure RewardScreen schreibt AsyncStorage.setItem("REWARD_COLLECTED", "true")
    checkComplete: async () => {
      const reward = await AsyncStorage.getItem("REWARD_COLLECTED");
      return reward === "true";
    },
  },
  {
    message: "Jetzt beschwöre Karten durch Summon!",
    screen: "SummonScreen",
    // SummonScreen muss nach erfolgreichem Summon AsyncStorage.setItem("summons", JSON.stringify([...])) aufrufen
    checkComplete: async () => {
      const data = await AsyncStorage.getItem("summons");
      const summons = data ? JSON.parse(data) : [];
      return summons.length > 0;
    },
  },
  {
    message: "Baue dein Deck im Deck-Bereich!",
    screen: "DeckScreen",
    // DeckScreen muss nach Deck-Bau AsyncStorage.setItem("deck", JSON.stringify([...])) aufrufen
    checkComplete: async () => {
      const data = await AsyncStorage.getItem("deck");
      const deck = data ? JSON.parse(data) : [];
      return deck.length > 0;
    },
  },
  {
    message: "Jetzt bist du bereit zu kämpfen! Viel Glück! ⚔️",
    screen: "HomeScreen",
    checkComplete: async () => true,
  },
];

export default function TutorialOverlay({ visible, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // Beim ersten Anzeigen initialisieren: vorhandenen Fortschritt übernehmen
  useEffect(() => {
    if (!visible) return;
    const init = async () => {
      // Tutorial komplett?
      const done = await AsyncStorage.getItem(TUTORIAL_DONE_KEY);
      if (done === "true") {
        onComplete();
        return;
      }
      // Finde ersten ungeklärten Step
      for (let i = 0; i < tutorialSteps.length; i++) {
        if (!(await tutorialSteps[i].checkComplete())) {
          setStepIndex(i);
          setModalOpen(true);
          return;
        }
      }
      // Alle Steps done
      await AsyncStorage.setItem(TUTORIAL_DONE_KEY, "true");
      onComplete();
    };
    init();
    return () => clearInterval(intervalRef.current);
  }, [visible]);

  // Polling startet immer, wenn "Weiter" gedrückt wird
  const startPolling = useCallback(() => {
    setLoading(true);
    intervalRef.current = setInterval(async () => {
      const done = await tutorialSteps[stepIndex].checkComplete();
      if (done) {
        clearInterval(intervalRef.current);
        setLoading(false);
        if (stepIndex < tutorialSteps.length - 1) {
          const next = stepIndex + 1;
          setStepIndex(next);
          // Sobald ein StepIndex gesetzt ist, Modal für nächsten anzeigen
          setModalOpen(true);
        } else {
          await AsyncStorage.setItem(TUTORIAL_DONE_KEY, "true");
          setModalOpen(false);
          onComplete();
        }
      }
    }, 1000);
  }, [stepIndex]);

  const handleNext = () => {
    setModalOpen(false);
    const { screen } = tutorialSteps[stepIndex];
    if (screen) navigation.navigate(screen);
    startPolling();
  };

  if (!visible || !modalOpen) return null;

  const { message } = tutorialSteps[stepIndex];
  return (
    <Modal transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.text}>{message}</Text>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" />
              <Text style={styles.loadingText}>
                Bitte Aufgabe abschließen...
              </Text>
            </View>
          ) : (
            <TouchableOpacity onPress={handleNext} style={styles.button}>
              <Text style={styles.buttonText}>Weiter</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    backgroundColor: "#222",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
    width: "80%",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#29a9ff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loaderContainer: {
    alignItems: "center",
  },
  loadingText: {
    color: "#00d2ff",
    fontSize: 16,
    marginTop: 10,
  },
});
