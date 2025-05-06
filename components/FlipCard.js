import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Platform,
  Text,
} from "react-native";

export default function FlipCard({
  frontContent,
  backContent,
  textColor,
  variant = "default",
  width = 100,
  height = 150,
  duration = 300,
  onFlipComplete,
}) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [flipped, setFlipped] = useState(false);
  const containerRef = useRef(null);

  const colorSchemes = {
    default: {
      borderColor: "#29a9ff",
      frontBg: "#1e1e1e",
      backBg: "#000",
      textColor: "#ffffff",
    },
    fire: {
      borderColor: "#ff4500",
      frontBg: "#330000",
      backBg: "#220000",
      textColor: "#ffcccc",
    },
    ice: {
      borderColor: "#00d4ff",
      frontBg: "#001f33",
      backBg: "#000f1a",
      textColor: "#ccf2ff",
    },
    water: {
      borderColor: "#1e90ff",
      frontBg: "#001e3c",
      backBg: "#001025",
      textColor: "#b3d9ff",
    },
    thunder: {
      borderColor: "#ffd700",
      frontBg: "#1a1a2e",
      backBg: "#0f0f1b",
      textColor: "#fff176",
    },
    shadow: {
      borderColor: "#5d3fd3",
      frontBg: "#0b0b0b",
      backBg: "#050505",
      textColor: "#e0e0e0",
    },
    nature: {
      borderColor: "#228B22",
      frontBg: "#1b3b1b",
      backBg: "#0f1f0f",
      textColor: "#b2fba5",
    },
    divine: {
      borderColor: "#fff59d",
      frontBg: "#fffde7",
      backBg: "#fff9c4",
      textColor: "#333333",
    },
    demonic: {
      borderColor: "#8b0000",
      frontBg: "#2b0000",
      backBg: "#3b0000",
      textColor: "#ffcccc",
    },
  };

  const scheme = colorSchemes[variant] || colorSchemes.default;
  const effectiveTextColor = textColor || scheme.textColor;

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
          {frontContent || (
            <Text style={[styles.text, { color: effectiveTextColor }]}>
              {variant}
            </Text>
          )}
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
          {backContent || (
            <Text style={[styles.text, { color: effectiveTextColor }]}>
              {variant}
            </Text>
          )}
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    margin: 8,
  },
  card: {
    position: "absolute",
    backfaceVisibility: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
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
  text: {
    fontSize: 16,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
});
