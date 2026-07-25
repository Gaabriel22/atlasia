import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { hasLocale } from "next-intl"

import { routing } from "@/i18n/routing"

export const alt = "Atlasia"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

const localizedCopy = {
  "pt-BR": {
    eyebrow: "ATLASIA · CATÁLOGO VIVO",
    title: "Descubra o mundo como quem abre um atlas.",
    description: "Países, capitais e geografia em uma exploração moderna.",
  },
  en: {
    eyebrow: "ATLASIA · LIVING CATALOG",
    title: "Discover the world like an explorer opening an atlas.",
    description: "Countries, capitals, and geography in a modern exploration.",
  },
} as const

type OpenGraphImageProps = {
  params: Promise<{ locale: string }>
}

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { locale: requestedLocale } = await params
  const locale = hasLocale(routing.locales, requestedLocale)
    ? requestedLocale
    : routing.defaultLocale
  const copy = localizedCopy[locale]
  const logo = await readFile(
    join(process.cwd(), "public", "brand", "atlasia-logo.png"),
    "base64",
  )

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 72,
        padding: "72px 84px",
        color: "#f3ead2",
        background:
          "linear-gradient(135deg, #07110d 0%, #10241b 58%, #2b2417 100%)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          maxWidth: 790,
        }}
      >
        <div
          style={{
            color: "#d9a85b",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 7,
          }}
        >
          {copy.eyebrow}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 38,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: -2,
          }}
        >
          {copy.title}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 30,
            color: "#c3bda9",
            fontSize: 30,
            lineHeight: 1.35,
          }}
        >
          {copy.description}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 220,
          height: 220,
          padding: 22,
          border: "2px solid #8c7040",
          borderRadius: 48,
          background: "#080d0a",
          boxShadow: "0 28px 70px rgba(0, 0, 0, 0.42)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders embedded image data without next/image. */}
        <img
          src={`data:image/png;base64,${logo}`}
          alt=""
          width={176}
          height={176}
        />
      </div>
    </div>,
    size,
  )
}
