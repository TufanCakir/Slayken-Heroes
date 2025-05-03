import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const rewardScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d0d", // etwas schönerer dunkler Hintergrund
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00d2ff",
    textAlign: "center",
    marginBottom: 20,
  },
  rewardText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  footerWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
});
