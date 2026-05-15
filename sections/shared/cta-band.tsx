import { ButtonLink } from "@/components/ui/button-link";
import { Reveal } from "@/components/ui/reveal";

export function CtaBand({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Reveal className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[34px] border border-border bg-brand-primary px-8 py-10 text-white shadow-soft">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
            <p className="mt-3 text-base leading-7 text-blue-100">{description}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/contact">Apply Now</ButtonLink>
            <ButtonLink href="/courses" variant="secondary">
              Explore Courses
            </ButtonLink>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
