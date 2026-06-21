import { NextResponse } from "next/server";
import { createBadgeSvg, fetchPluginData } from "@/lib/badge";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const plugin = await fetchPluginData(params.slug);
    if (!plugin) {
      return new NextResponse(
        createBadgeSvg("unknown @endgit", "not found", "#e05d44"),
        { headers: { "Content-Type": "image/svg+xml" } },
      );
    }

    const latestVersion =
      plugin.versions?.find((v: any) => v.isLatest) || plugin.versions?.[0];
    const versionLabel = latestVersion
      ? `v${latestVersion.version} @endgit`
      : `unknown @endgit`;
    const status = latestVersion ? latestVersion.status : plugin.status;

    let color = "#9ca3af"; // gray
    let message = status?.toLowerCase() || "unknown";

    if (status === "APPROVED") {
      color = "#4c1"; // green
      message = "Approved";
    } else if (status === "PENDING") {
      color = "#dfb317"; // yellow
      message = "Pending";
    } else if (status === "REJECTED") {
      color = "#e05d44"; // red
      message = "Rejected";
    }

    return new NextResponse(createBadgeSvg(versionLabel, message, color), {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new NextResponse(createBadgeSvg("error", "error", "#e05d44"), {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}
