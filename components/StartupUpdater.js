import React, { useState } from "react";
import { View } from "react-native";
import UpdateChecker from "./UpdateChecker";
import DownloaderScreen from "../screens/DownloaderScreen";

export default function StartupUpdater({ onFinish }) {
  const [step, setStep] = useState("checkingUpdate");

  const handleUpdateComplete = () => {
    setStep("downloadingAssets");
  };

  const handleAssetsDownloaded = () => {
    if (typeof onFinish === "function") {
      onFinish(); // signalisiere App.js, dass Startup abgeschlossen ist
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {step === "checkingUpdate" && (
        <UpdateChecker showStatus={true} onComplete={handleUpdateComplete} />
      )}

      {step === "downloadingAssets" && (
        <DownloaderScreen onComplete={handleAssetsDownloaded} />
      )}
    </View>
  );
}
