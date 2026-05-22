import { Skeleton } from "@/components/Skeleton";

export default function EditPluginLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="rounded-2xl border border-border/70 bg-card/80 p-6">
        <div className="mb-6">
          <Skeleton width="10rem" height="1.5rem" />
        </div>

        <div className="flex flex-col gap-5">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <div className="mb-2">
                <Skeleton width="6rem" height="0.875rem" />
              </div>
              <Skeleton
                width="100%"
                height="2.5rem"
                borderRadius="0.375rem"
              />
            </div>
          ))}

          <div>
            <div className="mb-2">
              <Skeleton width="5rem" height="0.875rem" />
            </div>
            <Skeleton
              width="100%"
              height="8rem"
              borderRadius="0.375rem"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Skeleton
              width="5rem"
              height="2.5rem"
              borderRadius="0.375rem"
            />
            <Skeleton
              width="5rem"
              height="2.5rem"
              borderRadius="0.375rem"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
