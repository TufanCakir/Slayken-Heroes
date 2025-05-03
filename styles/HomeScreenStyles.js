// styles/HomeScreenStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  background: { flex: 1 },
  islandLayer: {
    bottom: 80,
  },
  island: { position: "absolute", width: 100, height: 100 },

  islandWrapper: {
    position: "absolute",
  },
  levelButton: {
    position: "absolute",
    top: 5,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 2,
  },
  unlocked: { backgroundColor: "#1a90ff", borderColor: "#fff" },
  locked: { backgroundColor: "#2d3b4f", borderColor: "#888" },
  levelText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
  fightOverlay: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
    zIndex: 10,
  },
  fightTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 12,
  },
  fightButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 6,
  },
  fightText: { color: "#fff", fontWeight: "bold" },
  eventButton: {
    bottom: 30,
    left: 130,
    padding: 10,
    backgroundColor: "#003b5a",
    borderRadius: 8,
    marginHorizontal: 150,
  },
  eventButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  rewardButton: {
    marginHorizontal: 30,
    marginBottom: 20,
    backgroundColor: "#003b5a",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  rewardButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  newsButton: {
    top: 10,
    right: 130,
    padding: 10,
    backgroundColor: "#003b5a",
    borderRadius: 8,
    marginHorizontal: 150,
  },
  newsButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  footerWrapper: { position: "absolute", bottom: 0, width: "100%" },
  levelBar: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    paddingVertical: 8,
  },

  levelCircleWrapper: {
    marginHorizontal: 5,
    marginVertical: 4,
  },

  levelCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    fontSize: 16,
    borderWidth: 2,
  },

  levelDone: {
    color: "white",
    backgroundColor: "#4CAF50",
    borderColor: "#388E3C",
  },

  levelLocked: {
    color: "#bbb",
    backgroundColor: "#333",
    borderColor: "#555",
  },
  bonusPopup: {
    backgroundColor: "#003b5a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5, // Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 999,
  },

  bonusText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
