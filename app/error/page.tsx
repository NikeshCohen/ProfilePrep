import AuthErrorClient from "./_components/AuthErrorClient";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export async function AuthErrorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const error = params.error || "Default";

  return <AuthErrorClient initialError={error} />;
}

export default AuthErrorPage;
