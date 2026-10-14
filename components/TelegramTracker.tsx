"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/telegramTracker";

export default function TelegramTracker() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" ||
      (typeof window !== "undefined" &&
        (window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1" ||
          window.location.hostname.endsWith(".local")))
    ) {
      return;
    }
    trackPageView();
  }, []);

  return null;
}
