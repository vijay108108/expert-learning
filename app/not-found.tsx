import { ButtonLink } from "@/components/ui/button-link";

export default function NotFound() {
  return (
    <section className="px-4 py-32 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[36px] border border-border bg-card p-10 text-center shadow-soft">
        <span className="inline-flex rounded-full border border-brand-blue/15 bg-brand-blue/8 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue">
          404
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground">Page not found</h1>
        <p className="mt-4 text-base leading-7 text-muted">
          The page you were looking for isn’t here yet. Let’s get you back to the courses and admissions flow.
        </p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/">Back to Home</ButtonLink>
        </div>
      </div>
    </section>
  );
}
