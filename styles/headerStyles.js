import { StyleSheet } from "react-native";

export const headerStyles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 12,
    paddingHorizontal: 16,
    backgroundColor: "#003b5a",
    borderBottomWidth: 1,
    borderBottomColor: "#1a90ff33",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003b5a",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
  },

  label: {
    marginLeft: 6,
    color: "#fff",
    fontSize: 13,
  },

  value: {
    marginLeft: 6,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  xpSection: {
    flex: 1,
  },

  xpLabel: {
    color: "#fff",
    fontSize: 13,
    marginBottom: 4,
    fontWeight: "bold",
  },

  xpBar: {
    height: 18,
    backgroundColor: "#000",
    borderRadius: 9,
    overflow: "hidden",
    justifyContent: "center",
    paddingHorizontal: 6,
  },

  xpFill: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    backgroundColor: "#1a90ff",
  },

  xpText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    fontWeight: "bold",
    zIndex: 1,
  },
});
