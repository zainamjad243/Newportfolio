import { ImageResponse } from "next/og";
import { personalData } from "@/utils/data/personal-data";
import fs from "node:fs/promises";
import path from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

function getInitials(name) {
  return String(name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .join("");
}

export default async function Icon() {
  const profilePath = String(personalData?.profile || "");
  const rel = profilePath.startsWith("/") ? profilePath.slice(1) : profilePath;

  if (rel) {
    try {
      const buf = await fs.readFile(path.join(process.cwd(), "public", rel));
      return new Response(buf, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // fall through to generated icon
    }
  }

  const initials = getInitials(personalData?.name) || "ZA";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: "linear-gradient(135deg, #1a1443 0%, #16f2b3 100%)",
          color: "white",
          fontSize: 16,
          fontWeight: 800,
          letterSpacing: 1,
        }}
      >
        {initials}
      </div>
    ),
    size
  );
}

