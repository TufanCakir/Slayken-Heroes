import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1) Initialer State
const initialState = {
  crystals: 0,
  coins: 0,
  account: { id: null, name: "" },
  level: 1,
  xp: 0,
  inventory: [],
  deck: [],
  summons: [],
  musicOn: true,
  volume: 1.0,
  progress: {},
};

// 2) Reducer-Funktion
function gameReducer(state, action) {
  switch (action.type) {
    case "LOAD_STATE":
      return { ...state, ...action.payload };

    case "ADD_CRYSTALS":
      return { ...state, crystals: state.crystals + action.amount };
    case "SPEND_CRYSTALS":
      return {
        ...state,
        crystals: Math.max(0, state.crystals - action.amount),
      };
    case "ADD_COINS":
      return { ...state, coins: state.coins + action.amount };
    case "SPEND_COINS":
      return { ...state, coins: Math.max(0, state.coins - action.amount) };

    case "ADD_XP": {
      const newXp = state.xp + action.amount;
      const levelUps = Math.floor(newXp / 100);
      return {
        ...state,
        xp: newXp % 100,
        level: state.level + levelUps,
      };
    }

    case "ADD_ITEM": {
      const { itemId, qty } = action;
      const idx = state.inventory.findIndex((i) => i.itemId === itemId);
      const newInventory = [...state.inventory];
      if (idx >= 0) newInventory[idx].qty += qty;
      else newInventory.push({ itemId, qty });
      return { ...state, inventory: newInventory };
    }

    case "REMOVE_ITEM": {
      const { itemId, qty } = action;
      const newInventory = state.inventory
        .map((i) => (i.itemId === itemId ? { ...i, qty: i.qty - qty } : i))
        .filter((i) => i.qty > 0);
      return { ...state, inventory: newInventory };
    }

    case "ADD_SUMMON":
      return { ...state, summons: [...state.summons, action.character] };
    case "ADD_TO_DECK":
      return { ...state, deck: [...state.deck, action.card] };
    case "REMOVE_FROM_DECK":
      return {
        ...state,
        deck: state.deck.filter((_, i) => i !== action.index),
      };
    case "CLEAR_DECK":
      return { ...state, deck: [] };

    case "SET_VOLUME":
      return { ...state, volume: action.volume };
    case "TOGGLE_MUSIC":
      return { ...state, musicOn: !state.musicOn };

    case "COMPLETE_FIGHT": {
      const { islandId, fightId } = action;
      return {
        ...state,
        progress: {
          ...state.progress,
          [`${islandId}_${fightId}`]: true,
        },
      };
    }

    default:
      return state;
  }
}

// 3) Context und Provider
export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // 4) State beim Start laden
  useEffect(() => {
    AsyncStorage.getItem("GAME_STATE")
      .then((data) => {
        if (data) dispatch({ type: "LOAD_STATE", payload: JSON.parse(data) });
      })
      .catch(console.error);
  }, []);

  // 5) State bei jeder Änderung speichern
  useEffect(() => {
    AsyncStorage.setItem("GAME_STATE", JSON.stringify(state)).catch(
      console.error
    );
  }, [state]);

  // 6) Loginbonus (nur 1x pro Tag)
  const grantDailyLoginBonus = async () => {
    const today = new Date().toDateString(); // z. B. "Thu May 02 2025"
    const LAST_LOGIN_KEY = "LAST_LOGIN";

    try {
      const lastLogin = await AsyncStorage.getItem(LAST_LOGIN_KEY);
      if (lastLogin === today) return false; // heute schon erhalten

      dispatch({ type: "ADD_COINS", amount: 10 });
      dispatch({ type: "ADD_CRYSTALS", amount: 10 });

      await AsyncStorage.setItem(LAST_LOGIN_KEY, today);
      console.log("🎁 Loginbonus erhalten!");
      return true;
    } catch (err) {
      console.error("Loginbonus-Fehler:", err);
      return false;
    }
  };

  return (
    <GameContext.Provider value={{ state, dispatch, grantDailyLoginBonus }}>
      {children}
    </GameContext.Provider>
  );
};
