import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectTo = resolvedSearchParams.redirect || undefined;

  return (
    <>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <AuthForm mode="login" redirectTo={redirectTo} />
          <p className="mt-4 text-center text-sm text-brand-muted">
            Need an account?{" "}
            <Link
              href={redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup"}
              className="font-medium text-brand-blue hover:text-brand-blue-dark"
            >
              Create one here
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
