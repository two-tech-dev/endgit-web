import { fetchApi } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import EditPluginForm from "@/components/EditPluginForm";

async function getPlugin(slug: string) {
  const { data } = await fetchApi(`/api/v1/plugins/${slug}`);
  return data?.data || null;
}

export default async function EditPluginPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const plugin = await getPlugin(params.slug);

  if (!plugin) return notFound();

  const isAuthor = session?.user?.id === plugin.authorId;
  const isAdmin = session?.user?.trustLevel === "ADMIN";

  if (!isAuthor && !isAdmin) {
    redirect(`/plugins/${plugin.slug}`);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <EditPluginForm plugin={plugin} />
    </div>
  );
}
