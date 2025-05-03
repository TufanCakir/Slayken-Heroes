const fs = require("fs");
const path = require("path");
const eventsFolder = path.join(__dirname, "../data/events");

// Farben für Terminal
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`,
};

console.log(colors.blue("\n🎉 Verfügbare Events und Kämpfe:\n"));

const files = fs.readdirSync(eventsFolder).filter((f) => f.endsWith(".json"));
const allBosses = []; // ⬅️ Alle Bosse sammeln

files.forEach((file) => {
  const filePath = path.join(eventsFolder, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const eventId = path.basename(file, ".json");
  const eventName = data.name || "Unbekanntes Event";
  const rounds = data.rounds || "?";
  const rewards = data.rewards || { exp: 0, coins: 0, crystals: 0 };

  console.log(
    colors.green(`🎊 Event "${eventName}" (${eventId}): ${rounds} Runden`)
  );

  if (!data.fights) {
    console.log(colors.red(`   ⚠️ Keine Kämpfe definiert!`));
  } else {
    Object.entries(data.fights).forEach(([fightId, fightData]) => {
      const enemies = fightData.enemies || [];
      const enemyCount = enemies.length;

      const bossExists = enemies.some((e) => e.hp > 250);
      const fightInfo = bossExists
        ? `👑 Fight ${fightId}: ${enemyCount} Gegner`
        : `⚔️ Fight ${fightId}: ${enemyCount} Gegner`;

      console.log(
        "   " +
          (enemyCount === 0 ? colors.red(fightInfo) : colors.yellow(fightInfo))
      );

      // Bosse speichern
      enemies.forEach((enemy) => {
        allBosses.push({
          name: enemy.name,
          hp: enemy.hp,
          eventId,
          fightId,
        });
      });
    });
  }

  console.log(
    colors.blue(
      `   🎁 Belohnung: ${rewards.exp} XP, ${rewards.coins} Coins, ${rewards.crystals} Crystals`
    )
  );
  console.log(""); // Leerzeile
});

// 🧠 Bosse sortieren
allBosses.sort((a, b) => b.hp - a.hp);

// 🏆 Top 3 Bosse aus allen Events
console.log(colors.magenta("\n👑 Top 3 stärkste Event-Bosse:"));
allBosses.slice(0, 3).forEach((boss, idx) => {
  console.log(
    colors.magenta(
      ` ${idx + 1}. ${boss.name} - ${boss.hp} HP (Event ${
        boss.eventId
      } - Fight ${boss.fightId})`
    )
  );
});

console.log(""); // Abschluss
