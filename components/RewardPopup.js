import React from "react";
import { View, Text, Modal, Button } from "react-native";

const RewardPopup = ({ visible, onClose, rewards }) => {
  if (!rewards) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "80%",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
            Belohnung!
          </Text>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            🎉 {rewards.coins} Coins{"\n"}🎉 {rewards.crystals} Crystals
            erhalten!
          </Text>
          <Button title="Okay" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

export default RewardPopup;
