import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import PropTypes from "prop-types";
import useOnlineStatus from "../hooks/useOnlineStatus";

/**
 * OnlineGuard component: shows children only when online, otherwise displays a message.
 * @param {object} props
 * @param {React.ReactNode} props.children - Content to render when online
 * @param {string} [props.message] - Optional custom offline message
 * @param {object} [props.style] - Optional styles to apply to the container
 */
export default function OnlineGuard({ children, message, style }) {
  const isOnline = useOnlineStatus();

  // While checking status, show a loader
  if (isOnline === null) {
    return (
      <View style={[styles.centered, style]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Offline state
  if (!isOnline) {
    return (
      <View
        style={[styles.centered, style]}
        accessible
        accessibilityRole="alert"
      >
        <Text style={styles.text} accessibilityLiveRegion="polite">
          {message || "Bitte aktiviere deine Internetverbindung"}
        </Text>
      </View>
    );
  }

  // Online state: render children
  return <>{children}</>;
}

OnlineGuard.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.string,
  style: PropTypes.object,
};

OnlineGuard.defaultProps = {
  message: null,
  style: {},
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000",
    padding: 16,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});
