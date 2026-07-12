import Link from "next/link";
import { AuthForm } from "@/components/forms/auth-form";

type SignupPageProps = {
  searchParams: Promise<{
    redirect?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const resolvedSearchParams = await searchParams;
  const redirectTo = resolvedSearchParams.redirect || undefined;

  return (
    <>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <AuthForm mode="signup" redirectTo={redirectTo} />
          <p className="mt-4 text-center text-sm text-brand-muted">
            Already registered?{" "}
            <Link
              href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
              className="font-medium text-brand-blue hover:text-brand-blue-dark"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
