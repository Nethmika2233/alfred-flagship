import LoginForm from "@/app/login/_components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <LoginForm callbackUrl={callbackUrl} />
    </div>
  );
}
