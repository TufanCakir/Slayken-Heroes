import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { getCachedImage } from "../utils/ImageCache";

export default function CachedIslandImage({ imageUrl, style }) {
  const [uri, setUri] = useState(null);

  useEffect(() => {
    getCachedImage(imageUrl).then(setUri);
  }, [imageUrl]);

  if (!uri) return null;

  return <Image source={{ uri }} style={style} contentFit="contain" />;
}
