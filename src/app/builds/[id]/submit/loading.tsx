import { Skeleton } from "@/components/Skeleton";

export default function SubmitReviewLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[700px] rounded-2xl border border-border/70 bg-card/80 p-6">
        <Skeleton
          width="14rem"
          height="1.5rem"
          style={{ marginBottom: "0.5rem" }}
        />
        <Skeleton
          width="18rem"
          height="0.875rem"
          style={{ marginBottom: "1.5rem" }}
        />

        <div className="flex flex-col gap-5">
          <div>
            <Skeleton
              width="6rem"
              height="0.875rem"
              style={{ marginBottom: "0.5rem" }}
            />
            <Skeleton
              width="100%"
              height="2.5rem"
              borderRadius="var(--radius-md)"
            />
          </div>

          <div>
            <Skeleton
              width="8rem"
              height="0.875rem"
              style={{ marginBottom: "0.5rem" }}
            />
            <Skeleton
              width="100%"
              height="6rem"
              borderRadius="var(--radius-md)"
            />
          </div>

          <div>
            <Skeleton
              width="4rem"
              height="0.875rem"
              style={{ marginBottom: "0.5rem" }}
            />
            <div className="flex gap-2">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton
                  key={i}
                  width="5rem"
                  height="1.75rem"
                  borderRadius="var(--radius-full)"
                />
              ))}
            </div>
          </div>

          <Skeleton
            width="100%"
            height="2.75rem"
            borderRadius="var(--radius-md)"
          />
        </div>
      </div>
    </div>
  );
}
