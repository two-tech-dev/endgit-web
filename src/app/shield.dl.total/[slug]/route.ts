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
        createBadgeSvg("endgit", "not found", "#e05d44"),
        { headers: { "Content-Type": "image/svg+xml" } },
      );
    }

    let dl = plugin.downloads || 0;

    return new NextResponse(
      createBadgeSvg("endgit", `${dl} downloads total`, "#97ca00"),
      {
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=3600",
        },
      },
    );
  } catch (error) {
    return new NextResponse(createBadgeSvg("endgit", "error", "#e05d44"), {
      headers: { "Content-Type": "image/svg+xml" },
    });
  }
}
