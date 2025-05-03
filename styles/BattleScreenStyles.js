import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const BattleScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  fullBattlefield: {
    flex: 1,
    position: "relative",
  },
  fullBattlefieldImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  enemyOverlay: {
    position: "absolute",
    bottom: SCREEN_HEIGHT * 0.1, // <<< Stelle Gegner Richtung Boden!
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },
  enemy: {
    width: 90,
    alignItems: "center",
    justifyContent: "flex-end",
    position: "relative",
  },
  enemyImage: {
    width: 80,
    height: 80,
  },
  hpBarBackground: {
    width: 60,
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    marginTop: 6,
    overflow: "hidden",
  },
  hpBarFill: {
    height: 8,
    backgroundColor: "#00ff00",
    borderRadius: 4,
  },
  enemyName: {
    marginTop: 4,
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  attackZone: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 30,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
    height: 500,
  },
  attackZoneLabel: {
    color: "#00d2ff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  attackCards: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
  },
  attackCardWrapper: {
    marginHorizontal: 12,
    alignItems: "center",
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cardNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#aaa",
    marginTop: 4,
  },
  cardBackContent: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
  },
  beam: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    fontWeight: "bold",
  },
  playerHpWrapper: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  playerHpText: {
    color: "#00d2ff",
    fontWeight: "bold",
    marginTop: 4,
  },
  hpBarBackground: {
    width: "100%",
    height: 5,
    backgroundColor: "#444",
    borderRadius: 5,
    overflow: "hidden",
  },
  hpBarFill: {
    height: "100%",
    backgroundColor: "lime",
  },
  roundWrapper: {
    alignItems: "center",
  },
  roundText: {
    color: "#00d2ff",
    fontSize: 18,
    fontWeight: "bold",
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  gameOverText: {
    color: "#ff0000",
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
  },
});
