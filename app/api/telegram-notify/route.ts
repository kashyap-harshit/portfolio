import { NextRequest, NextResponse } from "next/server";

// Helper to convert ISO 2-letter country code into flag emoji (e.g., 'US' -> 🇺🇸)
function getCountryFlag(countryCode?: string | null): string {
  if (!countryCode || countryCode.length !== 2) return "🌐";
  try {
    const codePoints = countryCode
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  } catch {
    return "🌐";
  }
}

// Simple lightweight User-Agent parser (no heavy dependencies)
function parseUserAgent(uaString: string) {
  const ua = uaString.toLowerCase();

  // Bot detection
  const isBot = /bot|spider|crawl|slurp|googlebot|bingbot|duckduckbot|yandex|headless/i.test(
    uaString
  );

  // OS detection
  let os = "Unknown OS";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) os = "iOS";
  else if (ua.includes("mac os") || ua.includes("macintosh")) os = "macOS";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("linux")) os = "Linux";

  // Browser detection
  let browser = "Unknown Browser";
  if (ua.includes("edg/")) browser = "Edge";
  else if (ua.includes("chrome") && !ua.includes("edg")) browser = "Chrome";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("opera") || ua.includes("opr/")) browser = "Opera";

  // Device type
  let device = "💻 Desktop";
  if (ua.includes("ipad") || ua.includes("tablet")) device = "📱 Tablet";
  else if (ua.includes("mobile") || ua.includes("iphone") || ua.includes("android")) device = "📱 Mobile";

  return { isBot, os, browser, device };
}

export async function POST(req: NextRequest) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    // If Telegram credentials are not configured, exit quietly without erroring out
    if (!botToken || !chatId) {
      return NextResponse.json(
        { success: false, message: "Telegram environment variables not set" },
        { status: 200 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const {
      event = "page_view",
      title,
      details,
      referrer,
      path = "/",
      screenWidth,
      screenHeight,
      language,
      isInitialVisit = true,
    } = body;

    const userAgent = req.headers.get("user-agent") || "Unknown";
    const { isBot, os, browser, device } = parseUserAgent(userAgent);

    // Skip automated bots from spamming notifications
    if (isBot) {
      return NextResponse.json({ success: true, skipped: "bot" });
    }

    // Geolocation from Vercel / Cloudflare edge headers
    const country = req.headers.get("x-vercel-ip-country") || req.headers.get("cf-ipcountry") || "Unknown";
    const city = req.headers.get("x-vercel-ip-city") || "";
    const region = req.headers.get("x-vercel-ip-country-region") || "";
    const flag = getCountryFlag(country);

    const locationText = [city, region, country !== "Unknown" ? country : null]
      .filter(Boolean)
      .join(", ") || "Unknown Location";

    // Formulate a formatted Telegram message
    let message = "";

    const timestamp = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Kolkata", // adjust or standard UTC/Local
      dateStyle: "medium",
      timeStyle: "short",
    });

    if (event === "page_view") {
      message = [
        `🚨 <b>New Portfolio Visitor!</b> ${flag}`,
        `━━━━━━━━━━━━━━━━━━`,
        `📍 <b>Location:</b> ${locationText} ${flag}`,
        `🧭 <b>Referrer:</b> ${referrer ? `<code>${referrer}</code>` : "Direct / Bookmark"}`,
        `🖥️ <b>Device:</b> ${device} (${os} • ${browser})`,
        screenWidth && screenHeight ? `📐 <b>Screen:</b> ${screenWidth}x${screenHeight}` : null,
        language ? `🌐 <b>Language:</b> ${language}` : null,
        `🔗 <b>Path:</b> <code>${path}</code>`,
        `⏰ <b>Time:</b> ${timestamp} IST`,
      ]
        .filter(Boolean)
        .join("\n");
    } else {
      // Custom events: Resume Download, Link Clicks, Music Play, etc.
      message = [
        `⚡ <b>Portfolio Action: ${title || event}</b>`,
        `━━━━━━━━━━━━━━━━━━`,
        details ? `📝 <b>Details:</b> ${details}` : null,
        `📍 <b>Location:</b> ${locationText} ${flag}`,
        `🖥️ <b>Device:</b> ${device} (${os} • ${browser})`,
        `🔗 <b>Path:</b> <code>${path}</code>`,
        `⏰ <b>Time:</b> ${timestamp} IST`,
      ]
        .filter(Boolean)
        .join("\n");
    }

    // Send the message to Telegram API
    const telegramUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Telegram Bot Error]", errorText);
      return NextResponse.json({ success: false, error: errorText }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[Telegram Notify Route Error]", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
