import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getStyles = (color: string) => {
  switch (color) {
    case "red":
      return {
        color: "#dc2626", // updated lighter text color
        backgroundColor: "rgba(254,226,226,0.3)", // from #fee2e2 with 0.3 opacity
        ":hover": {
          color: "#ef4444", // updated lighter hover text color
          backgroundColor: "rgba(254,202,202,0.3)", // from #fecaca with 0.3 opacity
        },
      };
    case "blue":
      return {
        color: "#3b82f6", // updated lighter text color
        backgroundColor: "rgba(219,234,254,0.3)", // from #dbeafe
        ":hover": {
          color: "#60a5fa", // updated lighter hover text color
          backgroundColor: "rgba(191,219,254,0.3)", // from #bfdbfe
        },
      };
    case "green":
      return {
        color: "#2f855a", // updated lighter text color
        backgroundColor: "rgba(209,250,229,0.3)", // from #d1fae5
        ":hover": {
          color: "#38a169", // updated lighter hover text color
          backgroundColor: "rgba(167,243,208,0.3)", // from #a7f3d0
        },
      };
    case "orange":
      return {
        color: "#ea580c", // updated lighter text color
        backgroundColor: "rgba(254,227,216,0.3)", // from #fee3d8
        ":hover": {
          color: "#f97316", // updated lighter hover text color
          backgroundColor: "rgba(251,211,141,0.3)", // from #fbd38d
        },
      };
    case "purple":
      return {
        color: "#7e22ce", // updated lighter text color
        backgroundColor: "rgba(235,212,255,0.3)", // from #ebd4ff
        ":hover": {
          color: "#8b5cf6", // updated lighter hover text color
          backgroundColor: "rgba(212,188,249,0.3)", // from #d4bcf9
        },
      };
    case "yellow":
      return {
        color: "#facc15", // updated lighter text color
        backgroundColor: "rgba(250,240,137,0.3)",
        ":hover": {
          color: "#fde047", // updated lighter hover text color
          backgroundColor: "rgba(250,240,137,0.3)",
        },
      };
    case "pink":
      return {
        color: "#ec4899", // updated lighter text color
        backgroundColor: "rgba(244,143,177,0.3)",
        ":hover": {
          color: "#f472b6", // updated lighter hover text color
          backgroundColor: "rgba(236,112,99,0.3)",
        },
      };
    case "brown":
      return {
        color: "#cd853f", // updated lighter text color
        backgroundColor: "rgba(210,180,140,0.3)",
        ":hover": {
          color: "#d2a679", // updated lighter hover text color
          backgroundColor: "rgba(222,184,135,0.3)",
        },
      };
    case "indigo":
      return {
        color: "#6366f1", // updated lighter text color
        backgroundColor: "rgba(221,160,221,0.3)",
        ":hover": {
          color: "#818cf8", // updated lighter hover text color
          backgroundColor: "rgba(186,85,211,0.3)",
        },
      };
    case "cyan":
      return {
        color: "#06b6d4", // updated lighter text color
        backgroundColor: "rgba(224,255,255,0.3)",
        ":hover": {
          color: "#22d3ee", // updated lighter hover text color
          backgroundColor: "rgba(175,238,238,0.3)",
        },
      };
    case "lime":
      return {
        color: "#84cc16", // updated lighter text color
        backgroundColor: "rgba(240,230,140,0.3)",
        ":hover": {
          color: "#a3e635", // updated lighter hover text color
          backgroundColor: "rgba(189,183,107,0.3)",
        },
      };
    case "teal":
      return {
        color: "#14b8a6", // updated lighter text color
        backgroundColor: "rgba(175,238,238,0.3)",
        ":hover": {
          color: "#2dd4bf", // updated lighter hover text color
          backgroundColor: "rgba(127,255,212,0.3)",
        },
      };
    case "gray":
      return {
        color: "#6b7280", // updated lighter text color
        backgroundColor: "rgba(211,211,211,0.3)",
        ":hover": {
          color: "#9ca3af", // updated lighter hover text color
          backgroundColor: "rgba(169,169,169,0.3)",
        },
      };
    case "black":
      return {
        color: "#374151", // updated lighter text color
        backgroundColor: "rgba(200,200,200,0.3)",
        ":hover": {
          color: "#4b5563", // updated lighter hover text color
          backgroundColor: "rgba(169,169,169,0.3)",
        },
      };
    default:
      return {
        color: "#374151", // updated lighter default text color
        backgroundColor: "rgba(255,255,255,0.3)",
        ":hover": {
          color: "#374151",
          backgroundColor: "rgba(255,255,255,0.3)",
        },
      };
  }
};

export const getAppURLBYENV = () => {
  if (process.env.NODE_ENV === "development") {
    return process.env.NEXT_PUBLIC_APP_URL_DEV;
  }
  return process.env.NEXT_PUBLIC_APP_URL_PROD;
};
