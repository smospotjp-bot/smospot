import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SmoSpotApp } from "@/components/SmoSpotApp";
import { JsonLd } from "@/components/JsonLd";
import { AREAS, getArea } from "@/lib/areas";
import {
  webApplicationSchema,
  areaFaqSchema,
  absoluteUrl,
  SITE_KEYWORDS,
} from "@/lib/seo";

interface Params {
  params: { area: string };
}

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
      <JsonLd data={areaFaqSchema(area)} />

      <SmoSpotApp
        initialCenter={area.center}
        heading={`【${area.name}】の喫煙所・喫煙可能店マップ`}
      />

      {/* SEO: 静的テキストコンテンツ */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          {area.name}エリアの喫煙所について
        </h2>
        <p className="text-gray-700 leading-relaxed mb-6">{area.description}</p>

        <h3 className="text-lg font-bold mb-3 text-gray-900">
          {area.name}の喫煙所の特徴
        </h3>
        <ul className="list-disc pl-6 mb-6 space-y-1">
          {area.features.map((f, i) => (
            <li key={i} className="text-gray-700">
              {f}
            </li>
          ))}
        </ul>

        <h3 className="text-lg font-bold mb-3 text-gray-900">よくある質問</h3>
        {area.faqs.map((faq, i) => (
          <details key={i} className="mb-3 border border-gray-200 rounded-lg">
            <summary className="font-medium cursor-pointer p-4 hover:bg-gray-50">
              {faq.q}
            </summary>
            <p className="px-4 pb-4 text-gray-700">{faq.a}</p>
          </details>
        ))}
      </section>

      {/* SEO: 他エリアへの内部リンク */}
      <nav className="max-w-3xl mx-auto px-4 pb-8">
        <h3 className="text-lg font-bold mb-3 text-gray-900">
          他のエリアで喫煙所を探す
        </h3>
        <div className="flex flex-wrap gap-2">
          {AREAS.filter((a) => a.slug !== area.slug).map((a) => (
            <a
              key={a.slug}
              href={`/tokyo/${a.slug}`}
              className="px-3 py-1.5 bg-green-50 text-green-800 rounded-full text-sm hover:bg-green-100 transition-colors"
            >
              {a.name}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
