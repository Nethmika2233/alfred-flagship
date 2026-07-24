import type { Variants } from "framer-motion";

// Shared "expo-out"-like editorial easing curve, used throughout the storefront.
export const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_EDITORIAL } },
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};
