import * as FileSystem from "expo-file-system";

export async function getImageSource(source) {
  if (typeof source === "string" && source.startsWith("http")) {
    try {
      const filename = source.split("/").pop();
      const localPath = `${FileSystem.cacheDirectory}${filename}`;
      const info = await FileSystem.getInfoAsync(localPath);

      if (!info.exists) {
        await FileSystem.downloadAsync(source, localPath);
      }

      return { uri: localPath };
    } catch (err) {
      console.warn("⚠️ getImageSource Fehler:", err);
      return { uri: source };
    }
  }

  // Lokaler Import (z. B. require("./img.png"))
  return source;
}
