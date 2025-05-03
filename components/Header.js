import React from "react";
import { View, Text } from "react-native";
import { useGame } from "../hooks/useGame";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { headerStyles as styles } from "../styles/headerStyles";

export default function Header() {
  const { account, level, xp, coins, crystals } = useGame();

  return (
    <View style={styles.container}>
      {/* Obere Leiste: Account, Coins, Crystals */}
      <View style={styles.topRow}>
        <View style={styles.box}>
          <MaterialIcons name="account-circle" size={24} color="#1a90ff" />
          <Text style={styles.label}>Account</Text>
          <Text style={styles.value}>{account.name || account.id}</Text>
        </View>
        <View style={styles.box}>
          <FontAwesome6 name="coins" size={24} color="#1a90ff" />
          <Text style={styles.value}>{coins}</Text>
        </View>
        <View style={styles.box}>
          <MaterialCommunityIcons
            name="cards-diamond-outline"
            size={24}
            color="#1a90ff"
          />
          <Text style={styles.value}>{crystals}</Text>
        </View>
      </View>

      {/* XP-Leiste mit Level-Anzeige */}
      <View style={styles.bottomRow}>
        <View style={styles.xpSection}>
          <Text style={styles.xpLabel}>Level {level}</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${xp}%` }]} />
            <Text style={styles.xpText}>{xp}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
