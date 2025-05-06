import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { Animated, Easing } from "react-native";
import { allBattleData } from "../data/islands"; // <- Import von allen Inseln!
import { useGame } from "../hooks/useGame";

const VARIANT_RANGES = {
  fire: { min: 100, max: 100 },
  ice: { min: 100, max: 100 },
  thunder: { min: 100, max: 100 },
  shadow: { min: 100, max: 100 },
  water: { min: 100, max: 100 },
  natur: { min: 5, max: 10 },
  divine: { min: 100, max: 100 },
  demonic: { min: 100, max: 100 },
};

export function useEvent(
  initialEnemies = [],
  userDeck = [],
  onFinish,
  islandId,
  fightId
) {
  const { level } = useGame(); // Stelle sicher, dass useGame() VOR der Nutzung steht

  const [enemies, setEnemies] = useState(
    initialEnemies.map((e) => scaleEnemyHp(e, level))
  );

  const [beams, setBeams] = useState([]);
  const [battleCards, setBattleCards] = useState([]);
  const [currentRound, setCurrentRound] = useState(fightId || 1);
  const [maxRounds, setMaxRounds] = useState(1);
  const [rewards, setRewards] = useState({
    exp: 100,
    coins: 100,
    crystals: 10,
  });
  const enemyRefs = useRef([]);
  const baseHp = 100;
  const hpPerLevel = 10;
  const scaledMaxHp = baseHp + level * hpPerLevel;

  const [playerHp, setPlayerHp] = useState(scaledMaxHp);
  const playerMaxHp = scaledMaxHp;

  // 📌 Update HP bei Level-Änderung
  useEffect(() => {
    setPlayerHp(scaledMaxHp);
  }, [scaledMaxHp]);

  const deckVariants = useMemo(() => [...userDeck], [userDeck]);

  // Stage laden
  useEffect(() => {
    const islandData = allBattleData[islandId];
    if (islandData) {
      setMaxRounds(islandData.rounds || 1);
      setRewards(islandData.rewards || { exp: 100, coins: 100, crystals: 10 });
    }
  }, [islandId]);

  // Startkarten ziehen
  useEffect(() => {
    if (deckVariants.length > 0) {
      drawCards(5);
    }
  }, [deckVariants]);

  // Enemy-Refs aktuell halten
  useEffect(() => {
    enemyRefs.current = enemies.map(
      (_, idx) => enemyRefs.current[idx] || { current: null }
    );
  }, [enemies]);

  // Runde fertig -> nächste Runde laden
  useEffect(() => {
    if (enemies.length > 0 && enemies.every((e) => e.hp <= 0)) {
      loadNextRound();
    }
  }, [enemies]);

  const drawCards = (amount = 1) => {
    if (deckVariants.length === 0) return;
    const newCards = Array.from({ length: amount }, () => {
      const randomVariant =
        deckVariants[Math.floor(Math.random() * deckVariants.length)];
      return {
        id: generateId(),
        variant: randomVariant,
        damage: randomDamageFor(randomVariant),
      };
    });
    setBattleCards((prev) => [...prev, ...newCards]);
  };

  function randomDamageFor(variant) {
    const { min, max } = VARIANT_RANGES[variant] || { min: 20, max: 40 };
    const baseDamage = Math.floor(Math.random() * (max - min + 1)) + min;

    // Skalierung je nach Level (z. B. +2 Damage pro Level)
    const scaling = Math.floor(level * 2); // Ändere Faktor je nach Balance
    return baseDamage + scaling;
  }

  const loadNextRound = () => {
    const islandData = allBattleData[islandId];
    if (!islandData) return;

    if (currentRound >= islandData.rounds) {
      // Alle Runden beendet → Rewards vergeben
      onFinish?.({
        exp: rewards.exp,
        coins: rewards.coins,
        crystals: rewards.crystals,
      });
    } else {
      const nextFightId = currentRound + 1;
      const nextBattle = islandData.fights?.[nextFightId];
      if (nextBattle?.enemies) {
        setEnemies(nextBattle.enemies.map((e) => scaleEnemyHp(e, level)));
        setCurrentRound(nextFightId);
        drawCards(5);
      }
    }
  };

  const getRandomEnemyIndex = useCallback(() => {
    const alive = enemies
      .map((e, i) => (e.hp > 0 ? i : -1))
      .filter((i) => i !== -1);
    return alive.length > 0
      ? alive[Math.floor(Math.random() * alive.length)]
      : -1;
  }, [enemies]);

  const enemyAttackPlayer = useCallback(() => {
    if (enemies.length === 0) return;

    const aliveEnemies = enemies.filter((e) => e.hp > 0);
    if (aliveEnemies.length === 0) return;

    const randomEnemy =
      aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
    const damage = Math.floor(Math.random() * 10) + 5; // z.B. 5-15 Schaden

    setTimeout(() => {
      setPlayerHp((prevHp) => Math.max(0, prevHp - damage));
      console.log(
        `${randomEnemy.name} greift an! ⚡️ Verursachter Schaden: ${damage}`
      );
    }, 500); // 0.5 Sekunden nach deinem Angriff
  }, [enemies]);

  const attack = useCallback((card, layout, targetIndex) => {
    const ref = enemyRefs.current[targetIndex];
    if (!ref?.current?.measureInWindow) return;

    ref.current.measureInWindow((x, y, w, h) => {
      const fromX = layout.pageX + layout.width / 2;
      const fromY = layout.pageY + layout.height / 2;
      const toX = x + w / 2;
      const toY = y + h / 2;

      const anim = new Animated.Value(0);
      const id = generateId();

      setBeams((prev) => [
        ...prev,
        { id, anim, fromX, fromY, toX, toY, color: schemeColor(card.variant) },
      ]);

      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start(() => {
        setBeams((prev) => prev.filter((b) => b.id !== id));
        setEnemies((prev) =>
          prev.map((e, i) =>
            i === targetIndex
              ? { ...e, hp: Math.max(0, e.hp - card.damage) }
              : e
          )
        );
      });
    });
  }, []);

  function scaleEnemyHp(enemy, level) {
    const factor = 1 + level * 0.1; // 10 % mehr HP pro Level
    const newMaxHp = Math.round(enemy.maxHp * factor);
    return {
      ...enemy,
      maxHp: newMaxHp,
      hp: newMaxHp,
    };
  }

  const onFlipComplete = useCallback(
    (card, layout) => {
      const target = getRandomEnemyIndex();
      if (target < 0) return;

      attack(card, layout, target);

      setBattleCards((prev) => prev.filter((c) => c.id !== card.id));
      drawCards(1);

      // ✨ NEU: Spezialeffekt für Naturkarten
      if (card.variant === "nature" || card.variant === "natur") {
        setPlayerHp(playerMaxHp); // Komplett heilen!
        console.log("🌿 Naturkarte gespielt: Spieler vollständig geheilt!");
      } else {
        enemyAttackPlayer(); // Gegner greift nur an, wenn KEINE Naturkarte
      }
    },
    [attack, getRandomEnemyIndex, enemyAttackPlayer, playerMaxHp]
  );

  return {
    cards: battleCards,
    enemies,
    beams,
    enemyRefs: enemyRefs.current,
    onFlipComplete,
    playerHp,
    playerMaxHp,
    currentRound,
  };
}

// Hilfsfunktionen
function randomDamageFor(variant) {
  const { min, max } = VARIANT_RANGES[variant] || { min: 20, max: 40 };
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function schemeColor(variant) {
  const colors = {
    fire: "#ff4500",
    ice: "#00d4ff",
    thunder: "#ffd700",
    shadow: "#5d3fd3",
    water: "#1e90ff",
    nature: "#228B22",
    divine: "#fff59d",
    demonic: "#8b0000",
    default: "#29a9ff",
  };
  return colors[variant] || colors.default;
}
