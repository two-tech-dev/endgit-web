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

  const sessionUsername = (session?.user as any)?.username;
  const pluginAuthorUsername = plugin.author?.username;
  const isAuthor = !!sessionUsername && !!pluginAuthorUsername && sessionUsername === pluginAuthorUsername;

  if (!isAuthor) {
    redirect(`/plugins/${plugin.slug}`);
  }

  return (
    <div className="container py-6 lg:py-8">
      <EditPluginForm plugin={plugin} />
    </div>
  );
}
