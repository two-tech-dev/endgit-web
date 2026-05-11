import { fetchApi } from "@/lib/api";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
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
  const isAdmin = (session?.user as any)?.trustLevel === "ADMIN";

  if (!isAuthor && !isAdmin) {
    redirect(`/plugins/${plugin.slug}`);
  }

  return (
    <div className="container" style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-8)" }}>
      <EditPluginForm plugin={plugin} />
    </div>
  );
}
