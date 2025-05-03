import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Platform,
} from "react-native";

/**
 * FlipCard zeigt eine Karte, die bei Tap umklappt und Vorder-/Rückseite wechselt.
 * Props:
 * - frontContent: React-Node für Vorderseite
 * - backContent: React-Node für Rückseite
 * - variant: "fire", "ice", "water", "thunder", "shadow" oder "default" für Farbschema
 * - width, height: Kartengröße
 * - duration: Animationsdauer in ms (nur für Timing-API)
 * - onFlipComplete: Callback(layout) nach Abschluss des Flip zur Rückseite; liefert absolute Position
 */
export default function FlipCard({
  frontContent,
  backContent,
  variant = "default",
  width = 100,
  height = 150,
  duration = 300,
  onFlipComplete,
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);
  const containerRef = useRef(null);

  // Farbschemata definieren
  const colorSchemes = {
    default: { borderColor: "#29a9ff", frontBg: "#1e1e1e", backBg: "#000" },
    fire: { borderColor: "#ff4500", frontBg: "#330000", backBg: "#220000" },
    ice: { borderColor: "#00d4ff", frontBg: "#001f33", backBg: "#000f1a" },
    water: { borderColor: "#1e90ff", frontBg: "#001e3c", backBg: "#001025" },
    thunder: { borderColor: "#ffd700", frontBg: "#1a1a2e", backBg: "#0f0f1b" },
    shadow: { borderColor: "#5d3fd3", frontBg: "#0b0b0b", backBg: "#050505" },
    nature: { borderColor: "#228B22", frontBg: "#1b3b1b", backBg: "#0f1f0f" },
  };
  const scheme = colorSchemes[variant] || colorSchemes.default;

  // Interpolationen für Rotation
  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });
  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipCard = () => {
    const toValue = flipped ? 0 : 180;
    Animated.spring(animatedValue, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start(() => {
      if (!flipped && onFlipComplete) {
        if (containerRef.current?.measureInWindow) {
          containerRef.current.measureInWindow((x, y, w, h) => {
            onFlipComplete({ pageX: x, pageY: y, width: w, height: h });
          });
        } else if (containerRef.current?.measure) {
          containerRef.current.measure((_, __, w, h, px, py) => {
            onFlipComplete({ pageX: px, pageY: py, width: w, height: h });
          });
        }
      }
      setFlipped((prev) => !prev);
    });
  };

  return (
    <TouchableWithoutFeedback onPress={flipCard}>
      <View ref={containerRef} style={[styles.container, { width, height }]}>
        <Animated.View
          style={[
            styles.card,
            {
              width,
              height,
              backgroundColor: scheme.frontBg,
              borderColor: scheme.borderColor,
              transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
            },
          ]}
        >
          {frontContent}
        </Animated.View>

        <Animated.View
          style={[
            styles.card,
            {
              width,
              height,
              backgroundColor: scheme.backBg,
              borderColor: scheme.borderColor,
              transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
            },
          ]}
        >
          {backContent}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    margin: 8, // zusätzlicher Außenabstand
  },
  card: {
    position: "absolute",
    backfaceVisibility: "hidden",
    justifyContent: "center",
    borderRadius: 12, // größere Ecken
    borderWidth: 2,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
