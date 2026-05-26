/**
 * Cloudflare Worker — Eid al-Adha Card
 *
 * Routes:
 *   GET /og.png?name=X&msg=Y   → personalized 1200×630 PNG thumbnail
 *   GET /*                      → proxy GitHub Pages, rewriting OG meta tags
 *                                 for ?name= requests so WhatsApp crawlers
 *                                 see the personalised title / description /
 *                                 image without running JS.
 */

import { initWasm, Resvg } from "@resvg/resvg-wasm";
// @ts-ignore — wrangler 3 bundles *.wasm imports automatically
import resvgWasm from "@resvg/resvg-wasm/index_bg.wasm";

// ── constants ──────────────────────────────────────────────────────────────

const GH_PAGES = "https://sudosar.github.io";
const GH_BASE = "/eid-adha-card";
const STATIC_OG = `${GH_PAGES}${GH_BASE}/og-cover.png`;

// Google Fonts serves TTF when the old MSIE UA is used — stable for caching.
const FONT_CSS_URL =
  "https://fonts.googleapis.com/css?family=Lato:400,700&subset=latin";
const FONT_CACHE_KEY = "https://worker-font-cache.internal/lato-regular.ttf";
const FONT_BOLD_CACHE_KEY =
  "https://worker-font-cache.internal/lato-bold.ttf";

// ── WASM init (once per isolate lifetime) ─────────────────────────────────

let wasmReady = false;

async function ensureWasm(): Promise<void> {
  if (wasmReady) return;
  // initWasm accepts a WebAssembly.Module (bundled by wrangler) or a fetch Response
  await initWasm(resvgWasm as unknown as WebAssembly.Module);
  wasmReady = true;
}

// ── Font loading with edge-cache ───────────────────────────────────────────

/**
 * Fetches Google Fonts CSS with an old UA to get TTF src URLs, then fetches
 * one of those TTF files.  Results are cached in Cloudflare's Cache API.
 */
async function loadFont(
  weight: "400" | "700",
  cacheKey: string,
  ctx: ExecutionContext
): Promise<ArrayBuffer | null> {
  try {
    // caches.default is a Cloudflare Workers extension on CacheStorage
    const cache = (caches as unknown as { default: Cache }).default;

    const hit = await cache.match(cacheKey);
    if (hit) return hit.arrayBuffer();

    // Old MSIE UA → Google returns TTF format in the src list
    const cssResp = await fetch(
      `https://fonts.googleapis.com/css?family=Lato:${weight}&subset=latin`,
      { headers: { "User-Agent": "Mozilla/4.0 (compatible; MSIE 6.0)" } }
    );
    if (!cssResp.ok) return null;

    const css = await cssResp.text();
    // Extract the first url(...) that ends in .ttf
    const match = css.match(
      /url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.ttf)\)/
    );
    if (!match) return null;

    const fontResp = await fetch(match[1]);
    if (!fontResp.ok) return null;

    const buf = await fontResp.arrayBuffer();
    // Cache at edge for 30 days — fire-and-forget so response isn't delayed
    ctx.waitUntil(
      cache.put(
        cacheKey,
        new Response(new Blob([buf]), {
          headers: {
            "Content-Type": "font/ttf",
            "Cache-Control": "public, max-age=2592000",
          },
        })
      )
    );
    return buf;
  } catch {
    return null;
  }
}

// ── SVG template ───────────────────────────────────────────────────────────

function escXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildOgSvg(name: string | null, msg: string | null): string {
  const hasName = Boolean(name);
  // Shift Kaaba + text down slightly when no name line at top
  const textY = hasName ? 105 : 155;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0D0820"/>
      <stop offset="45%" stop-color="#2D1060"/>
      <stop offset="75%" stop-color="#7B2D00"/>
      <stop offset="100%" stop-color="#C45A00"/>
    </linearGradient>
    <radialGradient id="hglow" cx="50%" cy="78%" r="45%">
      <stop offset="0%" stop-color="#F0A020" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#F0A020" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="dune1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#8B5E1A"/>
      <stop offset="100%" stop-color="#3D2000"/>
    </linearGradient>
    <linearGradient id="dune2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6B4510"/>
      <stop offset="100%" stop-color="#2A1500"/>
    </linearGradient>
    <linearGradient id="kFront" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#050505"/>
    </linearGradient>
    <linearGradient id="kSide" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#2a2a2a"/>
      <stop offset="100%" stop-color="#111111"/>
    </linearGradient>
    <linearGradient id="kTop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3a3a3a"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </linearGradient>
    <linearGradient id="door" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#C8960A"/>
      <stop offset="50%" stop-color="#F0C75E"/>
      <stop offset="100%" stop-color="#A07008"/>
    </linearGradient>
    <linearGradient id="hizam" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#8B6914"/>
      <stop offset="30%" stop-color="#F0C75E"/>
      <stop offset="70%" stop-color="#F0C75E"/>
      <stop offset="100%" stop-color="#8B6914"/>
    </linearGradient>
    <linearGradient id="borderH" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="rgba(240,199,94,0)"/>
      <stop offset="30%" stop-color="rgba(240,199,94,0.7)"/>
      <stop offset="70%" stop-color="rgba(240,199,94,0.7)"/>
      <stop offset="100%" stop-color="rgba(240,199,94,0)"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#sky)"/>
  <rect width="1200" height="630" fill="url(#hglow)"/>

  <!-- Stars -->
  <g fill="white" opacity="0.55">
    <circle cx="80"   cy="55"  r="1.5"/>
    <circle cx="200"  cy="38"  r="1"/>
    <circle cx="340"  cy="75"  r="1.5"/>
    <circle cx="450"  cy="28"  r="1"/>
    <circle cx="720"  cy="42"  r="1"/>
    <circle cx="880"  cy="62"  r="1.5"/>
    <circle cx="980"  cy="33"  r="1"/>
    <circle cx="1100" cy="68"  r="1.5"/>
    <circle cx="160"  cy="108" r="1"/>
    <circle cx="960"  cy="110" r="1"/>
  </g>

  <!-- Top border line -->
  <rect x="0" y="18" width="1200" height="1" fill="url(#borderH)" opacity="0.7"/>

  ${
    hasName
      ? `<!-- Personalised name -->
  <text x="600" y="${textY}" text-anchor="middle"
        font-family="Lato, sans-serif" font-size="52" font-weight="400"
        fill="rgba(245,230,200,0.92)">${escXml(`Dear ${name},`)}</text>
  <line x1="420" y1="${textY + 16}" x2="780" y2="${textY + 16}"
        stroke="rgba(240,199,94,0.35)" stroke-width="1"/>`
      : ""
  }

  <!-- English title -->
  <text x="600" y="${textY + (hasName ? 68 : 0)}"
        text-anchor="middle" font-family="Lato, sans-serif"
        font-size="27" font-weight="700" letter-spacing="9"
        fill="#E8DCC8" opacity="0.95">EID AL-ADHA MUBARAK</text>

  <!-- Blessing -->
  <text x="600" y="${textY + (hasName ? 102 : 34)}"
        text-anchor="middle" font-family="Lato, sans-serif"
        font-size="15" fill="rgba(245,230,200,0.58)">May Allah accept your sacrifice and grant you His infinite mercy and blessings</text>

  ${
    msg
      ? `<!-- Custom message -->
  <text x="600" y="${textY + (hasName ? 128 : 60)}"
        text-anchor="middle" font-family="Lato, sans-serif"
        font-size="16" font-style="italic" fill="rgba(240,199,94,0.72)">— ${escXml(msg)}</text>`
      : ""
  }

  <!-- Kaaba: top face -->
  <polygon points="500,295 700,295 740,265 540,265"
           fill="url(#kTop)" stroke="rgba(240,199,94,0.3)" stroke-width="0.5"/>
  <!-- Kaaba: right side -->
  <polygon points="700,295 740,265 740,425 700,455"
           fill="url(#kSide)" stroke="rgba(240,199,94,0.2)" stroke-width="0.5"/>
  <!-- Kaaba: front face -->
  <rect x="500" y="295" width="200" height="160"
        fill="url(#kFront)" stroke="rgba(240,199,94,0.25)" stroke-width="0.5"/>

  <!-- Hizam belt -->
  <rect x="500" y="356" width="200" height="16" fill="url(#hizam)" opacity="0.85"/>
  <!-- Diamond motifs on belt -->
  <g fill="rgba(240,199,94,0.5)">
    <polygon points="540,364 545,358 550,364 545,370"/>
    <polygon points="570,364 575,358 580,364 575,370"/>
    <polygon points="600,364 605,358 610,364 605,370"/>
    <polygon points="630,364 635,358 640,364 635,370"/>
    <polygon points="660,364 665,358 670,364 665,370"/>
  </g>

  <!-- Door frame -->
  <rect x="570" y="358" width="60" height="97" rx="2" fill="rgba(240,199,94,0.9)"/>
  <!-- Door recess -->
  <rect x="573" y="361" width="54" height="91" rx="1" fill="url(#kFront)"/>
  <!-- Left panel -->
  <rect x="574" y="363" width="24" height="86" rx="1" fill="url(#door)"/>
  <!-- Right panel -->
  <rect x="602" y="363" width="24" height="86" rx="1" fill="url(#door)"/>
  <!-- Centre split -->
  <line x1="600" y1="363" x2="600" y2="449" stroke="rgba(0,0,0,0.4)" stroke-width="1"/>
  <!-- Top band -->
  <rect x="574" y="363" width="52" height="12" rx="1" fill="rgba(240,199,94,0.38)"/>
  <!-- Ring handles -->
  <circle cx="593" cy="406" r="3" fill="rgba(240,199,94,0.55)" stroke="rgba(240,199,94,0.9)" stroke-width="1"/>
  <circle cx="607" cy="406" r="3" fill="rgba(240,199,94,0.55)" stroke="rgba(240,199,94,0.9)" stroke-width="1"/>
  <!-- Threshold step -->
  <rect x="566" y="450" width="68" height="7" rx="1" fill="rgba(240,199,94,0.28)"/>

  <!-- Pole -->
  <line x1="600" y1="272" x2="600" y2="295" stroke="rgba(240,199,94,0.8)" stroke-width="2"/>
  <!-- Crescent -->
  <path d="M592,257 C592,249 599,244 607,245 C604,246 601,250 601,255 C601,260 604,264 607,265 C599,266 592,265 592,257Z"
        fill="rgba(240,199,94,0.9)"/>

  <!-- Desert dunes -->
  <path d="M0,522 Q150,462 350,492 Q500,512 600,482 Q720,452 900,492 Q1050,517 1200,492 L1200,630 L0,630Z"
        fill="url(#dune1)"/>
  <path d="M0,562 Q200,522 400,547 Q600,567 800,537 Q1000,512 1200,547 L1200,630 L0,630Z"
        fill="url(#dune2)"/>

  <!-- Bottom border + year -->
  <rect x="0" y="611" width="1200" height="1" fill="url(#borderH)" opacity="0.7"/>
  <text x="600" y="624" text-anchor="middle"
        font-family="Lato, sans-serif" font-size="11" letter-spacing="4"
        fill="rgba(245,230,200,0.32)">EID AL-ADHA 1447 AH</text>
</svg>`;
}

// ── Proxy URL helpers ──────────────────────────────────────────────────────

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Maps a worker pathname to the corresponding GitHub Pages URL.
 *
 * Vite builds with base="/eid-adha-card/" so assets are at
 * /eid-adha-card/assets/*. Those requests arrive at the worker with that
 * exact path and are forwarded unchanged. Only the bare "/" needs remapping.
 */
function toGhUrl(pathname: string, search: string): string {
  const path =
    pathname === "/" || pathname === ""
      ? `${GH_BASE}/`
      : pathname.startsWith(`${GH_BASE}/`) || pathname === GH_BASE
        ? pathname
        : `${GH_BASE}${pathname}`;
  return `${GH_PAGES}${path}${search}`;
}

// ── Worker entry point ─────────────────────────────────────────────────────

export default {
  async fetch(
    request: Request,
    _env: Record<string, unknown>,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);

    // ── /og.png — personalised thumbnail ────────────────────────────────
    if (url.pathname === "/og.png") {
      try {
        const name = url.searchParams.get("name");
        const msg = url.searchParams.get("msg");

        const [font] = await Promise.all([
          loadFont("400", FONT_CACHE_KEY, ctx),
          ensureWasm(),
        ]);

        const svg = buildOgSvg(name, msg);
        const opts =
          font
            ? {
                font: {
                  fontBuffers: [new Uint8Array(font)],
                  loadSystemFonts: false,
                },
              }
            : { font: { loadSystemFonts: false } };

        const resvg = new Resvg(svg, opts);
        const png = resvg.render().asPng();

        return new Response(png, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=3600",
          },
        });
      } catch (err) {
        console.error("OG PNG error:", err);
        // Fall back to static cover image
        return fetch(STATIC_OG);
      }
    }

    // ── All other requests — proxy GitHub Pages ──────────────────────────
    const ghUrl = toGhUrl(url.pathname, url.search);
    const upstream = await fetch(ghUrl, {
      headers: { Accept: request.headers.get("Accept") ?? "*/*" },
      redirect: "follow",
    });

    const ct = upstream.headers.get("content-type") ?? "";
    if (!ct.includes("text/html")) {
      // Pass non-HTML assets through unchanged
      return new Response(upstream.body, {
        status: upstream.status,
        headers: upstream.headers,
      });
    }

    // Build personalised OG values
    const name = url.searchParams.get("name");
    const msg = url.searchParams.get("msg");

    const ogImg = name
      ? `${url.origin}/og.png?name=${encodeURIComponent(name)}${msg ? "&msg=" + encodeURIComponent(msg) : ""}`
      : STATIC_OG;

    const title = name
      ? `Eid al-Adha Mubarak, ${name}! — عيد الأضحى مبارك`
      : "Eid al-Adha Mubarak — عيد الأضحى مبارك";

    const desc = name
      ? `A special Eid al-Adha greeting for ${name}. May Allah accept your sacrifice and grant you His infinite mercy and blessings.${msg ? " — " + msg : ""}`
      : "May Allah accept your sacrifice and grant you and your loved ones His infinite mercy and blessings. Eid al-Adha Mubarak!";

    // Rewrite response headers
    const headers = new Headers(upstream.headers);
    headers.set("Content-Type", "text/html; charset=utf-8");
    headers.delete("content-encoding"); // HTMLRewriter handles decompression
    headers.set(
      "Cache-Control",
      name ? "no-store" : "public, max-age=300"
    );

    // Stream the HTML through HTMLRewriter, patching meta tags in-place
    return new HTMLRewriter()
      .on('meta[property="og:title"]', {
        element(el) { el.setAttribute("content", title); },
      })
      .on('meta[property="og:description"]', {
        element(el) { el.setAttribute("content", desc); },
      })
      .on('meta[property="og:image"]', {
        element(el) { el.setAttribute("content", ogImg); },
      })
      .on('meta[name="twitter:title"]', {
        element(el) { el.setAttribute("content", title); },
      })
      .on('meta[name="twitter:description"]', {
        element(el) { el.setAttribute("content", desc); },
      })
      .on('meta[name="twitter:image"]', {
        element(el) { el.setAttribute("content", ogImg); },
      })
      .transform(
        new Response(upstream.body, {
          status: upstream.status,
          headers,
        })
      );
  },
};
