import { NextResponse } from "next/server";

function createBadgeSvg(label: string, message: string, color: string): string {
  const labelWidth = label.length * 7 + 10;
  const messageWidth = message.length * 7 + 10;
  const totalWidth = labelWidth + messageWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
    <linearGradient id="b" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
      <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <mask id="a">
      <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
    </mask>
    <g mask="url(#a)">
      <rect width="${labelWidth}" height="20" fill="#555"/>
      <rect x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
      <rect width="${totalWidth}" height="20" fill="url(#b)"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">
      <text x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
      <text x="${labelWidth / 2}" y="14">${label}</text>
      <text x="${labelWidth + messageWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${message}</text>
      <text x="${labelWidth + messageWidth / 2}" y="14">${message}</text>
    </g>
  </svg>`;
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    // We only need the latest approved version. The plugin API returns 'versions' if it's the detail endpoint
    const res = await fetch(`${apiUrl}/api/v1/plugins/${params.slug}`);

    if (!res.ok) {
      return new NextResponse(
        createBadgeSvg("version", "not found", "#e05d44"),
        {
          headers: { "Content-Type": "image/svg+xml" },
        },
      );
    }

    const { data: plugin } = await res.json();
    let versionStr = "unknown";

    if (plugin.versions && plugin.versions.length > 0) {
      const approvedVersion = plugin.versions.find(
        (v: any) => v.status === "APPROVED",
      );
      if (approvedVersion) {
        versionStr = approvedVersion.version;
      }
    }

    const color = versionStr === "unknown" ? "#9f9f9f" : "#4c1"; // brightgreen

    return new NextResponse(createBadgeSvg("version", versionStr, color), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new NextResponse(createBadgeSvg("version", "error", "#e05d44"), {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}
