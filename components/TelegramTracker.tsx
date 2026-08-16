"use client";

import { useEffect } from "react";
import { trackPageView } from "@/lib/telegramTracker";

export default function TelegramTracker() {
  useEffect(() => {
    trackPageView();
  }, []);

  return null;
}
