import type { LatLng } from "./types";

export interface Area {
  slug: string;
  /** Japanese district name, e.g. 新宿 */
  name: string;
  /** Reading in kana for metadata richness */
  reading: string;
  /** Map center (station vicinity) */
  center: LatLng;
  /** One-line blurb used in descriptions */
  blurb: string;
}

/** Tokyo districts with static SEO landing pages at /tokyo/[area]. */
export const AREAS: Area[] = [
  { slug: "shinjuku", name: "新宿", reading: "しんじゅく", center: { lat: 35.690921, lng: 139.700258 }, blurb: "繁華街・オフィス街が広がる新宿エリア" },
  { slug: "shibuya", name: "渋谷", reading: "しぶや", center: { lat: 35.658034, lng: 139.701636 }, blurb: "若者文化の中心地・渋谷エリア" },
  { slug: "ikebukuro", name: "池袋", reading: "いけぶくろ", center: { lat: 35.729503, lng: 139.71038 }, blurb: "東口・西口に商業施設が集まる池袋エリア" },
  { slug: "akihabara", name: "秋葉原", reading: "あきはばら", center: { lat: 35.698353, lng: 139.773114 }, blurb: "電気街として知られる秋葉原エリア" },
  { slug: "ginza", name: "銀座", reading: "ぎんざ", center: { lat: 35.671732, lng: 139.765008 }, blurb: "高級店が並ぶ銀座エリア" },
  { slug: "ueno", name: "上野", reading: "うえの", center: { lat: 35.713768, lng: 139.777254 }, blurb: "アメ横や公園で賑わう上野エリア" },
  { slug: "shinagawa", name: "品川", reading: "しながわ", center: { lat: 35.62876, lng: 139.73876 }, blurb: "ビジネス拠点・交通の要所の品川エリア" },
  { slug: "shimbashi", name: "新橋", reading: "しんばし", center: { lat: 35.666254, lng: 139.75835 }, blurb: "サラリーマンの街として有名な新橋エリア" },
  { slug: "roppongi", name: "六本木", reading: "ろっぽんぎ", center: { lat: 35.662836, lng: 139.731443 }, blurb: "ナイトライフが充実した六本木エリア" },
  { slug: "nakano", name: "中野", reading: "なかの", center: { lat: 35.705621, lng: 139.665773 }, blurb: "サブカルチャーの街・中野エリア" },
];

export function getArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}
