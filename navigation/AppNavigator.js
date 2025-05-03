// navigation/AppNavigator.js
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "../screens/StartScreen";
import HomeScreen from "../screens/HomeScreen";
import DeckScreen from "../screens/DeckScreen";
import CardListScreen from "../screens/CardListScreen";
import ShopScreen from "../screens/ShopScreen";
import BattleScreen from "../screens/BattleScreen";
import EventScreen from "../screens/EventScreen";
import ResultScreen from "../screens/ResultScreen";
import ResultEventScreen from "../screens/ResultEventScreen";
import NewsScreen from "../screens/NewsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SummonScreen from "../screens/SummonScreen";
import SummonResultScreen from "../screens/SummonResultScreen";
import RewardScreen from "../screens/RewardScreen";
import TosScreen from "../screens/TosScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="StartScreen"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="StartScreen" component={StartScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="DeckScreen" component={DeckScreen} />
      <Stack.Screen name="CardListScreen" component={CardListScreen} />
      <Stack.Screen name="SummonScreen" component={SummonScreen} />
      <Stack.Screen name="SummonResultScreen" component={SummonResultScreen} />
      <Stack.Screen name="ShopScreen" component={ShopScreen} />
      <Stack.Screen name="BattleScreen" component={BattleScreen} />
      <Stack.Screen name="EventScreen" component={EventScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
      <Stack.Screen name="ResultEventScreen" component={ResultEventScreen} />
      <Stack.Screen name="NewsScreen" component={NewsScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="RewardScreen" component={RewardScreen} />
      <Stack.Screen name="TosScreen" component={TosScreen} />
    </Stack.Navigator>
  );
}
