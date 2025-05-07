import React, { useState } from "react";
import { View } from "react-native";
import UpdateChecker from "./UpdateChecker";
import DownloaderScreen from "../screens/DownloaderScreen";

const STEP = {
  CHECKING_UPDATE: "checkingUpdate",
  DOWNLOADING_ASSETS: "downloadingAssets",
};

export default function StartupUpdater({ onFinish }) {
  const [step, setStep] = useState(STEP.CHECKING_UPDATE);

  const onUpdateCheckComplete = () => {
    setStep(STEP.DOWNLOADING_ASSETS);
  };

  const onAssetsDownloadComplete = () => {
    onFinish?.(); // Kürzere, moderne Schreibweise für: if (typeof onFinish === "function")
  };

  return (
    <View style={{ flex: 1 }}>
      {step === STEP.CHECKING_UPDATE && (
        <UpdateChecker showStatus onComplete={onUpdateCheckComplete} />
      )}
      {step === STEP.DOWNLOADING_ASSETS && (
        <DownloaderScreen onComplete={onAssetsDownloadComplete} />
      )}
    </View>
  );
}
