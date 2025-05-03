import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function TosScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.heading}>Nutzungsbedingungen</Text>

        <Text style={styles.text}>
          Willkommen bei Slayken Heroes. Durch die Nutzung dieser App stimmst du
          den folgenden Nutzungsbedingungen zu. Bitte lies sie sorgfältig durch.
        </Text>

        <Text style={styles.subheading}>1. Nutzung der App</Text>
        <Text style={styles.text}>
          Du darfst diese App nur in Übereinstimmung mit geltendem Recht und
          diesen Bedingungen verwenden. Du darfst keine Inhalte hochladen oder
          verbreiten, die gegen Gesetze, Rechte Dritter oder diese Bedingungen
          verstoßen.
        </Text>

        <Text style={styles.subheading}>2. Inhalte & Rechte</Text>
        <Text style={styles.text}>
          Alle Inhalte in dieser App, einschließlich Grafiken, Texte, Musik und
          Spielfiguren, sind urheberrechtlich geschützt und Eigentum des
          App-Entwicklers. Die Nutzung zu kommerziellen Zwecken ist untersagt.
        </Text>

        <Text style={styles.subheading}>3. Haftung</Text>
        <Text style={styles.text}>
          Die Nutzung der App erfolgt auf eigene Gefahr. Der Entwickler
          übernimmt keine Haftung für Schäden oder Verluste, die aus der Nutzung
          der App entstehen.
        </Text>

        <Text style={styles.subheading}>4. Änderungen</Text>
        <Text style={styles.text}>
          Diese Nutzungsbedingungen können jederzeit aktualisiert werden.
          Änderungen werden in der App veröffentlicht und gelten ab diesem
          Zeitpunkt.
        </Text>

        <Text style={styles.subheading}>5. Kontakt</Text>
        <Text style={styles.text}>
          Bei Fragen oder Anliegen kontaktiere bitte: support@tufancakir.com
        </Text>

        <Text style={styles.footer}>© 2025 Tufan Cakir</Text>
      </ScrollView>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Zurück</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scroll: {
    padding: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  subheading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 20,
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#ddd",
    lineHeight: 24,
  },
  footer: {
    marginTop: 40,
    fontSize: 14,
    textAlign: "center",
    color: "#888",
  },
  button: {
    backgroundColor: "#1e88e5",
    margin: 20,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
