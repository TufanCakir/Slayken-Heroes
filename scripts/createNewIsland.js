const fs = require("fs");
const path = require("path");

const islandsFolder = path.join(__dirname, "../data/islands");

const newIslandId = process.argv[2];

if (!newIslandId) {
  console.error(
    "❌ Bitte gib eine Island-ID an! Beispiel: npm run create-island 2"
  );
  process.exit(1);
}

const newIslandPath = path.join(islandsFolder, `${newIslandId}.json`);

if (fs.existsSync(newIslandPath)) {
  console.error("❌ Diese Insel existiert bereits!");
  process.exit(1);
}

const template = {
  rounds: 3,
  rewards: {
    exp: 300,
    coins: 300,
    crystals: 30,
  },
  fights: {
    1: {
      background:
        "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/plane/grassPlane.png",
      enemies: [
        {
          id: 1,
          name: "Dinoken",
          image:
            "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/animals/dinoken.png",
          hp: 100,
          maxHp: 100,
        },
        {
          id: 2,
          name: "Leoken",
          image:
            "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/animals/leonken.png",
          hp: 120,
          maxHp: 120,
        },
        {
          id: 3,
          name: "Bärenken",
          image:
            "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/animals/baerken.png",
          hp: 140,
          maxHp: 140,
        },
      ],
    },
  },
};

fs.writeFileSync(newIslandPath, JSON.stringify(template, null, 2));
console.log(`✅ Neue Insel ${newIslandId}.json wurde erstellt!`);
