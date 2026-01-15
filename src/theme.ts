import { NextUIProvider } from "@nextui-org/react";

export const theme = {
  light: {
    colors: {
      background: "#ffffff",
      foreground: "#171717",
      primary: {
        50: "#fff7ed",
        100: "#ffedd5",
        200: "#fed7aa",
        300: "#fdba74",
        400: "#fb923c",
        500: "#f97316", // Primary orange
        600: "#ea580c",
        700: "#c2410c",
        800: "#9a3412",
        900: "#7c2d12",
        DEFAULT: "#f97316",
        foreground: "#ffffff",
      },
      secondary: {
        50: "#fef2f2",
        100: "#fee2e2",
        200: "#fecaca",
        300: "#fca5a5",
        400: "#f87171",
        500: "#ef4444",
        600: "#dc2626",
        700: "#b91c1c",
        800: "#991b1b",
        900: "#7f1d1d",
        DEFAULT: "#ef4444",
        foreground: "#ffffff",
      },
    },
  },
  dark: {
    colors: {
      background: "#0a0a0a",
      foreground: "#ededed",
      primary: {
        50: "#2c1204",
        100: "#451d07",
        200: "#5e290a",
        300: "#77340e",
        400: "#904011",
        500: "#f97316", // Primary orange - vibrant in dark mode
        600: "#ffa34d",
        700: "#ffb577",
        800: "#ffc8a0",
        900: "#ffd9c4",
        DEFAULT: "#f97316",
        foreground: "#ffffff",
      },
      secondary: {
        50: "#1c0a0a",
        100: "#2e1111",
        200: "#401818",
        300: "#521f1f",
        400: "#642626",
        500: "#762d2d",
        600: "#883434",
        700: "#9a3b3b",
        800: "#ac4242",
        900: "#be4949",
        DEFAULT: "#762d2d",
        foreground: "#ffffff",
      },
    },
  },
};
