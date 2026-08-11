import { loadFont as loadOutfit } from "@remotion/google-fonts/Outfit";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

export const { fontFamily: outfit } = loadOutfit("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const { fontFamily: inter } = loadInter("normal", {
  weights: ["300", "400", "500", "600"],
  subsets: ["latin"],
});
