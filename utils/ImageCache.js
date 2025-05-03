import * as FileSystem from "expo-file-system";

const memoryCache = {};

export const getCachedImage = async (remoteUrl) => {
  if (!remoteUrl || typeof remoteUrl !== "string") return null;

  // Memory-Cache nutzen, falls vorhanden
  if (memoryCache[remoteUrl]) return memoryCache[remoteUrl];

  try {
    const filename = remoteUrl.split("/").pop();
    const localPath = `${FileSystem.cacheDirectory}${filename}`;
    const info = await FileSystem.getInfoAsync(localPath);

    if (!info.exists) {
      await FileSystem.downloadAsync(remoteUrl, localPath);
      console.log("📥 Gespeichert:", filename);
    } else {
      console.log("✅ Aus Cache:", filename);
    }

    memoryCache[remoteUrl] = localPath;
    return localPath;
  } catch (err) {
    console.warn("⚠️ Fehler bei Bild:", remoteUrl, err);
    return remoteUrl; // Fallback zur Remote-URL
  }
};
