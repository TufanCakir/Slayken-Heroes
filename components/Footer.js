import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function Footer() {
  const navigation = useNavigation();

  const tabs = [
    {
      icon: <AntDesign name="home" size={50} color="#1a90ff" />,
      route: "HomeScreen",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="cards-outline"
          size={50}
          color="#1a90ff"
        />
      ),
      route: "DeckScreen",
    },
    {
      icon: (
        <MaterialCommunityIcons name="crystal-ball" size={50} color="#1a90ff" />
      ),
      route: "SummonScreen",
    },
    {
      icon: (
        <MaterialCommunityIcons
          name="cards-variant"
          size={50}
          color="#1a90ff"
        />
      ),
      route: "CardListScreen",
    },
    {
      icon: <AntDesign name="shoppingcart" size={50} color="#1a90ff" />,
      route: "ShopScreen",
    },

    {
      icon: <AntDesign name="setting" size={50} color="#1a90ff" />,
      route: "SettingsScreen",
    },
  ];

  return (
    <View style={styles.footer}>
      {tabs.map((tab, index) => (
        <Pressable
          key={index}
          onPress={() => navigation.navigate(tab.route)}
          style={styles.button}
        >
          {tab.icon}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    backgroundColor: "#003b5a",
    paddingTop: 10,
    paddingHorizontal: 12,
    paddingBottom: 8,
    paddingVertical: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003b5a",
  },
});
