import { useGame } from "./useGame"; // 🎯
import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import songsData from "../data/songs.json";

export function useMusicManager() {
  const { musicOn, volume } = useGame(); // 🎯
  const [sound, setSound] = useState(null);

  useEffect(() => {
    loadRandomSong();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    if (sound) {
      if (musicOn) {
        sound.playAsync();
      } else {
        sound.pauseAsync();
      }
    }
  }, [musicOn, sound]);

  useEffect(() => {
    if (sound) {
      sound.setVolumeAsync(volume);
    }
  }, [volume, sound]);

  const loadRandomSong = async () => {
    const songsArray = songsData.songs;
    if (!songsArray || songsArray.length === 0) return;

    const randomSong =
      songsArray[Math.floor(Math.random() * songsArray.length)];

    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: randomSong.url },
        { isLooping: true, volume: volume }
      );
      setSound(newSound);
      if (musicOn) {
        await newSound.playAsync();
      }
    } catch (error) {
      console.error("Fehler beim Laden des Songs:", error);
    }
  };

  return { sound };
}
