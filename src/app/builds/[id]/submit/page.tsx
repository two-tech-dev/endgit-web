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
      <div className="mx-auto w-full max-w-4xl px-4 py-10 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Build not found
        </h1>
        <p className="text-muted-foreground">
          The build you are looking for does not exist.
        </p>
      </div>
    );
  }

  if (build.status !== "SUCCESS") {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-10 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Build not successful
        </h1>
        <p className="text-muted-foreground">
          Only successful builds can be submitted for review.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <SubmitReviewForm
        buildId={build.id}
        buildNumber={build.buildNumber}
        plugin={build.plugin}
      />
    </div>
  );
}
