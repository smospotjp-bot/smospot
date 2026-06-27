import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SmoSpotApp } from "@/components/SmoSpotApp";
import { JsonLd } from "@/components/JsonLd";
import { AREAS, getArea } from "@/lib/areas";
import { webApplicationSchema, faqSchema, absoluteUrl, SITE_KEYWORDS } from "@/lib/seo";

interface Params {
  params: { area: string };
}

/** Pre-render every area page at build time. */
export function generateStaticParams() {
  return AREAS.map((a) => ({ area: a.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const area = getArea(params.area);
  if (!area) return {};

  const title = `【${area.name}】の喫煙所・喫煙可能店マップ`;
  const description = `${area.name}（${area.reading}）周辺の喫煙所・喫煙可能カフェ・喫煙可能レストランを地図で検索。${area.blurb}でタバコが吸える場所をリアルタイムに表示します。`;
  const path = `/tokyo/${area.slug}`;

  return {
    title,
    description,
    keywords: [
      `${area.name} 喫煙所`,
      `${area.name} 喫煙可能`,
      `${area.name} タバコ 吸える`,
      `${area.name} 喫煙スポット`,
      ...SITE_KEYWORDS,
    ],
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ja_JP",
      url: absoluteUrl(path),
      title: `${title}｜SmoSpot（スモスポ）`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title}｜SmoSpot（スモスポ）`,
      description,
    },
  };
}

export default function AreaPage({ params }: Params) {
  const area = getArea(params.area);
  if (!area) notFound();

  return (
    <>
      <JsonLd data={webApplicationSchema()} />
      <JsonLd data={faqSchema()} />
      <SmoSpotApp
        initialCenter={area.center}
        heading={`【${area.name}】の喫煙所・喫煙可能店マップ`}
      />
    </>
  );
}
