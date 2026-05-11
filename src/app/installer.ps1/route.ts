import { redirect } from "next/navigation";

export async function GET() {
  redirect(
    "https://raw.githubusercontent.com/two-tech-dev/endgit-cli/refs/heads/main/installer.ps1",
  );
}
