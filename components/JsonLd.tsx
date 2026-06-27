/**
 * Injects a JSON-LD structured-data script. Rendered server-side; the payload
 * is our own trusted object (no user input), so dangerouslySetInnerHTML is safe.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
