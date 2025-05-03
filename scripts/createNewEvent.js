const fs = require("fs");
const path = require("path");

const eventsFolder = path.join(__dirname, "../data/events");
const newEventId = process.argv[2];

if (!newEventId) {
  console.error(
    "❌ Bitte gib eine Event-ID an! Beispiel: npm run create-event halloween"
  );
  process.exit(1);
}

const newEventPath = path.join(eventsFolder, `${newEventId}.json`);

if (fs.existsSync(newEventPath)) {
  console.error("❌ Dieses Event existiert bereits!");
  process.exit(1);
}

// Helper für deutsches Datum
function toGermanDate(date) {
  return date.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Aktuelles Datum
const now = new Date();
// Enddatum = heute + 7 Tage
const end = new Date();
end.setDate(now.getDate() + 7);

// Template für ein neues Event
const template = {
  name: "Neues Event",
  description: "Ein spannendes Event beginnt!",
  startDate: toGermanDate(now),
  endDate: toGermanDate(end),
  rewards: {
    exp: 500,
    coins: 500,
    crystals: 50,
  },
  fights: {
    1: {
      background:
        "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/plane/eventPlane.png",
      enemies: [
        {
          id: 1,
          name: "Event-Boss",
          image:
            "https://raw.githubusercontent.com/TufanCakir/slayken-assets/main/animals/eventboss.png",
          hp: 500,
          maxHp: 500,
        },
      ],
    },
  },
};

fs.writeFileSync(newEventPath, JSON.stringify(template, null, 2));
console.log(`✅ Neues Event ${newEventId}.json wurde erstellt!`);
