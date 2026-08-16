/**
 * Client-side tracker helper for Telegram visitor notifications.
 */

// Simple in-memory debounce cache for rapid clicks
const eventCooldown = new Map<string, number>();

export async function trackPageView() {
  if (typeof window === "undefined") return;

  // Avoid sending duplicate "new visitor" alerts on simple reloads in the same session
  try {
    const hasTrackedSession = sessionStorage.getItem("tg_visit_tracked");
    if (hasTrackedSession) return;
  } catch {
    // Ignore storage restrictions if cookies/storage are disabled
  }

  const payload = {
    event: "page_view",
    path: window.location.pathname || "/",
    referrer: document.referrer || "",
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    language: navigator.language,
  };

  try {
    const res = await fetch("/api/telegram-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      try {
        sessionStorage.setItem("tg_visit_tracked", "true");
      } catch {
        /* ignore */
      }
    }
  } catch (err) {
    // Silent fail so visitor UX is never interrupted
    console.debug("[Telegram Tracker]", err);
  }
}

export async function trackCustomEvent(title: string, details?: string) {
  if (typeof window === "undefined") return;

  // Prevent double-triggering the same event within 3 seconds
  const key = `${title}:${details || ""}`;
  const now = Date.now();
  const lastFired = eventCooldown.get(key) || 0;
  if (now - lastFired < 3000) return;
  eventCooldown.set(key, now);

  const payload = {
    event: "custom_action",
    title,
    details,
    path: window.location.pathname || "/",
    referrer: document.referrer || "",
  };

  try {
    await fetch("/api/telegram-notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.debug("[Telegram Tracker]", err);
  }
}
