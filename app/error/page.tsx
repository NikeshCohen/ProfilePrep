import AuthErrorClient from "@/app/error/_components/AuthErrorClient";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AuthErrorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = params.error || "Default";

  return <AuthErrorClient initialError={error} />;
}
