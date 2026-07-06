import { SmoSpotApp } from "@/components/SmoSpotApp";
import { JsonLd } from "@/components/JsonLd";
import { webApplicationSchema, faqSchema } from "@/lib/seo";
import { AREAS } from "@/lib/areas";

export default function Home() {
  return (
    <>
      <JsonLd data={webApplicationSchema()} />
      <JsonLd data={faqSchema()} />
      <SmoSpotApp heading="近くの喫煙所・喫煙可能店を地図で検索" />

      {/* SEO: エリア別リンク一覧 */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4 text-gray-900">
          東京都内のエリア別喫煙所マップ
        </h2>
        <p className="text-gray-700 mb-4">
          東京都内の主要エリアごとに、喫煙所や喫煙可能な飲食店を地図で検索できます。各エリアの喫煙事情やおすすめスポットもご紹介しています。
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {AREAS.map((area) => (
            <a
              key={area.slug}
              href={`/tokyo/${area.slug}`}
              className="block p-4 border border-gray-200 rounded-lg hover:bg-green-50 transition-colors"
            >
              <span className="font-bold text-gray-900">{area.name}</span>
              <span className="block text-sm text-gray-500 mt-1">
                {area.blurb}
              </span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
