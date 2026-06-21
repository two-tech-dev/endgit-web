import { NextResponse } from "next/server";
import { createBadgeSvg, fetchPluginData } from "@/lib/badge";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const plugin = await fetchPluginData(params.slug);
    if (!plugin) {
      return new NextResponse(createBadgeSvg("unknown @endgit", "not found", "#e05d44"), { headers: { "Content-Type": "image/svg+xml" } });
    }

    const latestVersion = plugin.versions?.find((v: any) => v.isLatest) || plugin.versions?.[0];
    const versionLabel = latestVersion ? `v${latestVersion.version} @endgit` : `unknown @endgit`;
    
    let apis = "unknown";
    if (latestVersion?.supportedApis?.length) {
      apis = latestVersion.supportedApis.join(", ");
    }

    return new NextResponse(createBadgeSvg(versionLabel, apis, "#97ca00"), {
      headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=3600" },
    });
  } catch (error) {
    return new NextResponse(createBadgeSvg("error", "error", "#e05d44"), { headers: { "Content-Type": "image/svg+xml" } });
  }
}
