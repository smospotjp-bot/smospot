/**
 * Central SEO config. Set NEXT_PUBLIC_SITE_URL to the production domain in
 * Vercel (e.g. https://smospot.jp). The fallback only affects local builds.
 */
import type { Area } from "./areas";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://smospot.jp"
).replace(/\/$/, "");

export const SITE_NAME = "SmoSpot";
export const SITE_TITLE =
  "SmoSpot（スモスポ）| 近くの喫煙所・喫煙可能店を地図で検索";
export const SITE_DESCRIPTION =
  "GPS で現在地周辺の喫煙所・喫煙可能カフェ・喫煙可能レストランを地図で検索。東京・都内の喫煙スポットをリアルタイムで表示。";

export const SITE_KEYWORDS = [
  "喫煙所",
  "喫煙可能",
  "喫煙スポット",
  "喫煙できる場所",
  "都内喫煙所",
  "東京喫煙所",
  "喫煙可能カフェ",
  "喫煙可能レストラン",
  "喫煙可能店舗",
  "タバコ吸える場所",
  "屋内喫煙",
  "喫煙室",
];

/** Absolute URL helper for canonical / OG. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Structured data: the app itself. */
export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    alternateName: "スモスポ",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    applicationCategory: "TravelApplication",
    operatingSystem: "Web",
    inLanguage: "ja",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "JPY",
    },
  };
}

/** Structured data: FAQ shown on home page. */
export function faqSchema() {
  const qa: [string, string][] = [
    [
      "近くの喫煙所はどうやって探せますか？",
      "SmoSpotの「現在地」ボタンを押すと、GPSで現在地周辺の喫煙所・喫煙可能な飲食店を地図とリストに表示します。検索バーからエリア名で探すこともできます。",
    ],
    [
      "喫煙可否の情報は正確ですか？",
      "店舗情報はGoogleマップを元に取得し、喫煙可否はユーザー投稿に基づいています。実際の状況を保証するものではないため、最新情報は各店舗へご確認ください。",
    ],
    [
      "GPSの精度はどのくらいですか？",
      "お使いの端末のGPS精度に依存します。屋内やビルの多い場所では誤差が出る場合があります。その際は検索バーにエリア名や駅名を入力して検索してください。",
    ],
    [
      "利用は無料ですか？",
      "はい、SmoSpotは無料でご利用いただけます。会員登録も不要です。",
    ],
  ];
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: qa.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/** Structured data: area-specific FAQ for /tokyo/[area] pages. */
export function areaFaqSchema(area: Area) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: area.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}
