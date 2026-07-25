import type { Graph, Thing, WithContext } from "schema-dts"

type JsonLdProps = {
  data: Graph | WithContext<Thing>
}

export function serializeJsonLd(data: JsonLdProps["data"]) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
