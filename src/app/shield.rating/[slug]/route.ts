import { NextResponse } from 'next/server';

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

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const res = await fetch(`${apiUrl}/api/v1/plugins/${params.slug}`);
    
    if (!res.ok) {
      return new NextResponse(createBadgeSvg("rating", "not found", "#e05d44"), {
        headers: { 'Content-Type': 'image/svg+xml' }
      });
    }

    const { data: plugin } = await res.json();
    const avgRating = plugin.stars ? Math.round((plugin.stars / 20) * 10) / 10 : 0;
    
    let color = "#9f9f9f"; // lightgrey
    if (avgRating >= 4.5) color = "#4c1"; // brightgreen
    else if (avgRating >= 3.5) color = "#97ca00"; // green
    else if (avgRating >= 2.5) color = "#dfb317"; // yellow
    else if (avgRating > 0) color = "#fe7d37"; // orange

    const message = avgRating > 0 ? `${avgRating}/5` : "unrated";

    return new NextResponse(createBadgeSvg("rating", message, color), {
      headers: { 
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    return new NextResponse(createBadgeSvg("rating", "error", "#e05d44"), {
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }
}
