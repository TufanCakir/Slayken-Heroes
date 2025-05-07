import React, { useMemo } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import PropTypes from "prop-types";
import useOnlineStatus from "../hooks/useOnlineStatus";

function OnlineGuard({
  children,
  message,
  containerStyle,
  spinnerSize,
  spinnerColor,
}) {
  const isOnline = useOnlineStatus();

  const combinedStyle = useMemo(
    () => [styles.centered, containerStyle],
    [containerStyle]
  );

  const renderLoading = () => (
    <SafeAreaView style={combinedStyle}>
      <ActivityIndicator
        size={spinnerSize}
        color={spinnerColor}
        accessibilityLabel="Lade Verbindungsstatus"
      />
    </SafeAreaView>
  );

  const renderOffline = () => (
    <SafeAreaView style={combinedStyle} accessible accessibilityRole="alert">
      <Text style={styles.text} accessibilityLiveRegion="polite">
        {message}
      </Text>
    </SafeAreaView>
  );

  if (isOnline === null) return renderLoading();
  if (!isOnline) return renderOffline();

  return <>{children}</>;
}

OnlineGuard.propTypes = {
  children: PropTypes.node.isRequired,
  message: PropTypes.string,
  containerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  spinnerSize: PropTypes.oneOfType([
    PropTypes.oneOf(["small", "large"]),
    PropTypes.number,
  ]),
  spinnerColor: PropTypes.string,
};

OnlineGuard.defaultProps = {
  message: "Bitte aktiviere deine Internetverbindung.",
  containerStyle: {},
  spinnerSize: "large",
  spinnerColor: "#ffffff",
};

export default OnlineGuard;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 16,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
  },
});
