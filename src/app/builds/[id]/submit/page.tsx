import { redirect } from "next/navigation";
import SubmitReviewForm from "@/components/SubmitReviewForm";

async function getBuild(id: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  try {
    const res = await fetch(`${apiUrl}/api/v1/builds/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default async function SubmitReviewPage({
  params,
}: {
  params: { id: string };
}) {
  const build = await getBuild(params.id);

  if (!build) {
    return (
      <div className="container pt-10 text-center mx-auto px-4">
        <h1 className="heading-2">Build not found</h1>
        <p className="text-text-muted mt-2">
          The build you are looking for does not exist.
        </p>
      </div>
    );
  }

  if (build.status !== "SUCCESS") {
    return (
      <div className="container pt-10 text-center mx-auto px-4">
        <h1 className="heading-2">Build not successful</h1>
        <p className="text-text-muted mt-2">
          Only successful builds can be submitted for review.
        </p>
      </div>
    );
  }

  // Allow editing the submission even if already submitted

  return (
    <div className="container pt-10 pb-16 mx-auto px-4">
      <SubmitReviewForm
        buildId={build.id}
        buildNumber={build.buildNumber}
        plugin={build.plugin}
      />
    </div>
  );
}
