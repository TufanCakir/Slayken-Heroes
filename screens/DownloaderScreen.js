import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Text, Button, StyleSheet, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import * as Progress from "react-native-progress";

import songs from "../data/songs.json";
import mapData from "../data/mapData.json";
import enemies from "../data/enemies.json";
import backgrounds from "../data/backgrounds.json";
import attackZone from "../data/attackZone.json";

const formatBytes = (bytes) => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  while (bytes >= 1000 && i < units.length - 1) {
    bytes /= 1000;
    i++;
  }
  return `${bytes.toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
};

export default function DownloaderScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [downloadedSize, setDownloadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [fileCount, setFileCount] = useState(0);

  const collectAssetUrls = useCallback(() => {
    const urls = [
      ...songs.songs.map(song => song.url),
      ...mapData.filter(island => island.image).map(island => island.image),
      ...Object.values(enemies).filter(value => typeof value === "string"),
      ...(backgrounds.image ? [backgrounds.image] : [])
    ];

    if (attackZone?.fights && typeof attackZone.fights === "object") {
      Object.values(attackZone.fights).forEach(fight => {
        if (fight?.background) urls.push(fight.background);
        if (Array.isArray(fight.enemies)) {
          fight.enemies.forEach(enemy => {
            if (enemy?.image) urls.push(enemy.image);
          });
        }
      });
    }

    return urls;
  }, []);

  const urls = useMemo(() => collectAssetUrls(), [collectAssetUrls]);

  useEffect(() => {
    const checkIfAllCached = async () => {
      setFileCount(urls.length);

      const allFilesExist = await Promise.all(
        urls.map(async (url) => {
          const filename = url.split("/").pop();
          const localUri = `${FileSystem.documentDirectory}${filename}`;
          const { exists } = await FileSystem.getInfoAsync(localUri);
          return exists;
        })
      );

      if (allFilesExist.every(Boolean)) {
        console.log("✅ Alle Assets bereits vorhanden.");
        setFinished(true);
        onComplete?.();
      }
    };

    checkIfAllCached();
  }, [urls, onComplete]);

  const downloadAll = useCallback(async () => {
    setFileCount(urls.length);
    setDownloading(true);

    let completed = 0;
    let downloadedBytes = 0;

    const getSizeOfUrl = async (url) => {
      try {
        const response = await fetch(url, { method: "HEAD" });
        const size = response.headers.get("content-length");
        return size ? parseInt(size, 10) : 0;
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
      const localUri = `${FileSystem.documentDirectory}${filename}`;

      const { exists } = await FileSystem.getInfoAsync(localUri);
      if (!exists) {
        try {
          await FileSystem.downloadAsync(url, localUri);
          downloadedBytes += size;
        } catch (error) {
          console.warn("Fehler beim Download:", url, error);
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
    onComplete?.();
  }, [urls, onComplete]);

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
