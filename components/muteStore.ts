"use client";
import { useSyncExternalStore } from "react";

/**
 * Global mute state shared by every audio source on the site (the About song
 * player and the snare-cursor hits). The state lives on `window` (not a module
 * variable) so that even if this module is evaluated more than once across
 * bundles/HMR, every reader and writer sees the exact same object — the mute
 * toggle and the cursor can never drift out of sync.
 *
 * `getMuted()` reads synchronously (for non-React code like the cursor's click
 * handler); components stay reactive via `useMuted()`.
 */
type Store = { muted: boolean; listeners: Set<() => void> };

const FALLBACK: Store = { muted: false, listeners: new Set() };

function store(): Store {
  if (typeof window === "undefined") return FALLBACK;
  const w = window as unknown as { __muteStore?: Store };
  if (!w.__muteStore) w.__muteStore = { muted: false, listeners: new Set() };
  return w.__muteStore;
}

export function getMuted() {
  return store().muted;
}

export function setMuted(next: boolean) {
  const s = store();
  if (s.muted === next) return;
  s.muted = next;
  try {
    localStorage.setItem("site-muted", next ? "1" : "0");
  } catch {
    /* localStorage unavailable — just skip persistence */
  }
  s.listeners.forEach((l) => l());
}

export function toggleMuted() {
  setMuted(!getMuted());
}

const subscribe = (cb: () => void) => {
  const s = store();
  s.listeners.add(cb);
  return () => {
    s.listeners.delete(cb);
  };
};

export function useMuted(): boolean {
  // Server snapshot is always `false` and the store starts `false`, so the
  // first client render matches SSR (no hydration mismatch). The persisted
  // value is loaded in an effect after mount (see MuteToggle).
  return useSyncExternalStore(subscribe, () => store().muted, () => false);
}
