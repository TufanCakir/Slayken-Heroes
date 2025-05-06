import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Progress from "react-native-progress";

import songs from "../data/songs.json";
import mapData from "../data/mapData.json";
import enemies from "../data/enemies.json";
import backgrounds from "../data/backgrounds.json";
import attackZone from "../data/attackZone.json";

const formatBytes = (bytes) => {
  if (bytes >= 1_000_000_000) return (bytes / 1_000_000_000).toFixed(2) + " GB";
  if (bytes >= 1_000_000) return (bytes / 1_000_000).toFixed(1) + " MB";
  if (bytes >= 1_000) return (bytes / 1_000).toFixed(0) + " KB";
  return bytes + " B";
};

export default function DownloaderScreen(props) {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [downloadedSize, setDownloadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [fileCount, setFileCount] = useState(0);

  const collectAssetUrls = () => {
    const urls = [];

    songs.songs.forEach((song) => urls.push(song.url));
    mapData.forEach((island) => {
      if (island.image) urls.push(island.image);
    });
    Object.values(enemies).forEach((value) => {
      if (typeof value === "string") urls.push(value);
    });
    if (backgrounds.image) urls.push(backgrounds.image);

    if (
      attackZone &&
      attackZone.fights &&
      typeof attackZone.fights === "object"
    ) {
      Object.values(attackZone.fights).forEach((fight) => {
        if (fight?.background) urls.push(fight.background);
        if (Array.isArray(fight.enemies)) {
          fight.enemies.forEach((enemy) => {
            if (enemy?.image) urls.push(enemy.image);
          });
        }
      });
    }

    return urls;
  };

  // Prüfen ob alle Assets bereits lokal existieren
  useEffect(() => {
    const checkIfAllCached = async () => {
      const urls = collectAssetUrls();
      setFileCount(urls.length);

      const allFilesExist = await Promise.all(
        urls.map(async (url) => {
          const filename = url.split("/").pop();
          const localUri = FileSystem.documentDirectory + filename;
          const info = await FileSystem.getInfoAsync(localUri);
          return info.exists;
        })
      );

      if (allFilesExist.every((x) => x)) {
        console.log("✅ Alle Assets bereits vorhanden.");
        setFinished(true);
        props.onComplete?.(); // optionaler Callback an StartupUpdater
      }
    };

    checkIfAllCached();
  }, []);

  const downloadAll = async () => {
    const urls = collectAssetUrls();
    setFileCount(urls.length);
    setDownloading(true);

    let completed = 0;
    let downloadedBytes = 0;

    const getSizeOfUrl = async (url) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        const size = response.headers.get("content-length");
        return size ? parseInt(size) : 0;
      } catch (e) {
        console.warn("❌ HEAD fehlgeschlagen für:", url);
        return 0;
      }
    };

    const sizes = await Promise.all(urls.map(getSizeOfUrl));
    const total = sizes.reduce((a, b) => a + b, 0);
    setTotalSize(total);

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];
      const size = sizes[i];
      const filename = url.split("/").pop();
      const localUri = FileSystem.documentDirectory + filename;

      const fileInfo = await FileSystem.getInfoAsync(localUri);
      if (!fileInfo.exists) {
        try {
          await FileSystem.downloadAsync(url, localUri);
          downloadedBytes += size;
        } catch (error) {
          console.warn("Fehler beim Download:", url);
        }
      } else {
        downloadedBytes += size;
      }

      completed++;
      setProgress(completed / urls.length);
      setDownloadedSize(downloadedBytes);
    }

    setDownloading(false);
    setFinished(true);

    // Callback für StartupUpdater
    props.onComplete?.();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Neue Daten verfügbar</Text>
      {fileCount > 0 && (
        <Text style={styles.subtitle}>Gesamt: {fileCount} Dateien</Text>
      )}

      {!downloading && !finished && (
        <Button title="Herunterladen starten" onPress={downloadAll} />
      )}

      {downloading && (
        <>
          <Progress.Bar progress={progress} width={250} />
          <Text style={styles.progressText}>
            {Math.round(progress * fileCount)} / {fileCount} Dateien
          </Text>
          <Text style={styles.progressText}>
            {formatBytes(downloadedSize)} / {formatBytes(totalSize)}
          </Text>
        </>
      )}

      {finished && <Text style={styles.done}>✔️ Download abgeschlossen!</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    alignItems: "center",
    paddingBottom: 200,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  progressText: {
    marginTop: 10,
  },
  done: {
    marginTop: 20,
    fontSize: 18,
    color: "green",
  },
});
