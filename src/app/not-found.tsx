import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-16 text-center min-h-[60vh] grid place-items-center">
      <h1 className="text-[clamp(4rem,10vw,8rem)] font-extrabold text-text-muted leading-none m-0">
        404
      </h1>
      <p className="text-xl text-text-secondary mt-4 max-w-[480px]">
        The page you're looking for doesn't exist or has been removed.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto justify-center">
        <Link
          href="/"
          className="btn btn-primary py-3 px-6 text-[15px] no-underline w-full sm:w-auto flex items-center justify-center"
        >
          Go Home
        </Link>
        <Link
          href="/plugins"
          className="btn btn-secondary py-3 px-6 text-[15px] no-underline w-full sm:w-auto flex items-center justify-center"
        >
          Browse Plugins
        </Link>
      </div>
    </div>
  );
}
