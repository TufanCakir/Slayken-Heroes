import { useContext, useCallback } from "react";
import { GameContext } from "../context/GameContext";

export const useGame = () => {
  const { state, dispatch, grantDailyLoginBonus } = useContext(GameContext);

  const addCrystals = useCallback(
    (amount) => dispatch({ type: "ADD_CRYSTALS", amount }),
    [dispatch]
  );
  const spendCrystals = useCallback(
    (amount) => dispatch({ type: "SPEND_CRYSTALS", amount }),
    [dispatch]
  );
  const addCoins = useCallback(
    (amount) => dispatch({ type: "ADD_COINS", amount }),
    [dispatch]
  );
  const spendCoins = useCallback(
    (amount) => dispatch({ type: "SPEND_COINS", amount }),
    [dispatch]
  );
  const addXP = useCallback(
    (amount) => dispatch({ type: "ADD_XP", amount }),
    [dispatch]
  );
  const addItem = useCallback(
    (itemId, qty) => dispatch({ type: "ADD_ITEM", itemId, qty }),
    [dispatch]
  );
  const removeItem = useCallback(
    (itemId, qty) => dispatch({ type: "REMOVE_ITEM", itemId, qty }),
    [dispatch]
  );
  const addSummon = useCallback(
    (character) => dispatch({ type: "ADD_SUMMON", character }),
    [dispatch]
  );
  const addToDeck = useCallback(
    (card) => dispatch({ type: "ADD_TO_DECK", card }),
    [dispatch]
  );
  const removeFromDeck = useCallback(
    (index) => dispatch({ type: "REMOVE_FROM_DECK", index }),
    [dispatch]
  );
  const clearDeck = useCallback(
    () => dispatch({ type: "CLEAR_DECK" }),
    [dispatch]
  );
  const toggleMusic = useCallback(
    () => dispatch({ type: "TOGGLE_MUSIC" }),
    [dispatch]
  );

  const completeFight = useCallback(
    (islandId, fightId) => {
      dispatch({ type: "COMPLETE_FIGHT", islandId, fightId });
    },
    [dispatch]
  );

  const isFightCompleted = useCallback(
    (islandId, fightId) => {
      return state.progress?.[`${islandId}_${fightId}`] === true;
    },
    [state.progress]
  );

  return {
    // State
    crystals: state.crystals,
    coins: state.coins,
    account: state.account,
    level: state.level,
    xp: state.xp,
    inventory: state.inventory,
    summons: state.summons,
    deck: state.deck,
    musicOn: state.musicOn,
    volume: state.volume,
    progress: state.progress || {},

    // Actions
    addCrystals,
    spendCrystals,
    addCoins,
    spendCoins,
    addXP,
    addItem,
    removeItem,
    addSummon,
    addToDeck,
    removeFromDeck,
    clearDeck,
    toggleMusic,
    completeFight,
    isFightCompleted,

    // Extras
    dispatch,
    grantDailyLoginBonus, // ✅ Loginbonus verfügbar
  };
};
