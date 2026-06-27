import { SmoSpotApp } from "@/components/SmoSpotApp";
import { JsonLd } from "@/components/JsonLd";
import { webApplicationSchema, faqSchema } from "@/lib/seo";

export default function Home() {
  return (
    <>
      <JsonLd data={webApplicationSchema()} />
      <JsonLd data={faqSchema()} />
      <SmoSpotApp heading="近くの喫煙所・喫煙可能店を地図で検索" />
    </>
  );
}
