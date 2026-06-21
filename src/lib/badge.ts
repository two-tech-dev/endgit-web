import { fetchGraphQL } from "@/lib/api";

export function createBadgeSvg(
  label: string,
  message: string,
  color: string,
): string {
  const labelWidth = Math.round(label.length * 6.5) + 14;
  const messageWidth = Math.round(message.length * 6.5) + 14;
  const totalWidth = labelWidth + messageWidth;

  const labelX = Math.round((labelWidth / 2) * 10);
  const messageX = Math.round((labelWidth + messageWidth / 2) * 10);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${message}">
    <title>${label}: ${message}</title>
    <linearGradient id="s" x2="0" y2="100%">
      <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
      <stop offset="1" stop-opacity=".1"/>
    </linearGradient>
    <clipPath id="r">
      <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
    </clipPath>
    <g clip-path="url(#r)">
      <rect width="${labelWidth}" height="20" fill="#555"/>
      <rect x="${labelWidth}" width="${messageWidth}" height="20" fill="${color}"/>
      <rect width="${totalWidth}" height="20" fill="url(#s)"/>
    </g>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
      <text aria-hidden="true" x="${labelX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${label}</text>
      <text x="${labelX}" y="140" transform="scale(.1)" fill="#fff">${label}</text>
      <text aria-hidden="true" x="${messageX}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)">${message}</text>
      <text x="${messageX}" y="140" transform="scale(.1)" fill="#fff">${message}</text>
    </g>
  </svg>`;
}

export async function fetchPluginData(slug: string) {
  try {
    const { data } = await fetchGraphQL(
      `
        query GetPlugin($slug: String!) {
          plugin(slug: $slug) {
            status
            downloads
            versions { version status downloads supportedApis isLatest }
          }
        }
      `,
      { slug },
      { noAuth: true },
    );
    return data?.plugin || null;
  } catch (error) {
    console.error("fetchPluginData error:", error);
    return null;
  }
}
