"use client";

import { useEffect } from "react";

export default function FontLoader() {
  useEffect(() => {
    // Check if the font link already exists
    const existingLink = document.querySelector(
      'link[href*="geomanist"]'
    );

    if (!existingLink) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/gh/joashpereira/geomanist@latest/geomanist.css";
      document.head.appendChild(link);
    }
  }, []);

  return null;
}
