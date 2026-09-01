import { useEffect } from "react";

function sampleArtworkColor(imageUrl, onColor) {
  const image = new Image();
  image.crossOrigin = "anonymous";
  image.src = imageUrl;

  image.onload = () => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    canvas.width = 24;
    canvas.height = 24;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    try {
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      let red = 0;
      let green = 0;
      let blue = 0;
      let weight = 0;

      for (let index = 0; index < pixels.length; index += 16) {
        const alpha = pixels[index + 3] / 255;
        const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3;
        if (alpha < 0.5 || brightness < 18 || brightness > 242) continue;

        red += pixels[index] * alpha;
        green += pixels[index + 1] * alpha;
        blue += pixels[index + 2] * alpha;
        weight += alpha;
      }

      if (weight > 0) {
        onColor({
          red: Math.round(red / weight),
          green: Math.round(green / weight),
          blue: Math.round(blue / weight),
        });
      }
    } catch {
      // Spotify artwork can still render if its CDN blocks canvas color sampling.
    }
  };

  return () => {
    image.onload = null;
  };
}

export default function useArtworkTheme(imageUrl, routeClass) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add(routeClass);

    let cancelSampling;
    if (imageUrl) {
      cancelSampling = sampleArtworkColor(imageUrl, ({ red, green, blue }) => {
        root.style.setProperty(
          "--artwork-hero-light",
          `rgb(${Math.round(red * 0.25 + 255 * 0.75)} ${Math.round(
            green * 0.25 + 255 * 0.75
          )} ${Math.round(blue * 0.25 + 255 * 0.75)})`
        );
        root.style.setProperty(
          "--artwork-hero-dark",
          `rgb(${Math.round(red * 0.4 + 14 * 0.6)} ${Math.round(
            green * 0.4 + 18 * 0.6
          )} ${Math.round(blue * 0.4 + 28 * 0.6)})`
        );
      });
    }

    return () => {
      cancelSampling?.();
      root.classList.remove(routeClass);
      root.style.removeProperty("--artwork-hero-light");
      root.style.removeProperty("--artwork-hero-dark");
    };
  }, [imageUrl, routeClass]);
}
