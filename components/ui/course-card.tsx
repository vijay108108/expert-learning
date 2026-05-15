import { ArrowUpRight, Clock3, Star } from "lucide-react";
import { iconMap } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import type { Course } from "@/data/courses";
import { ButtonLink } from "@/components/ui/button-link";

export function CourseCard({
  course,
  featured = false,
}: {
  course: Course;
  featured?: boolean;
}) {
  const Icon = iconMap[course.icon];

  return (
    <article
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[24px] border border-border bg-card p-5 shadow-[0_18px_42px_rgba(11,31,58,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(11,31,58,0.14)] sm:rounded-[28px] sm:p-6",
        featured && "pulse-border",
      )}
    >
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-brand-cyan/70 to-transparent" />
      <div className="flex items-start justify-between gap-4">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue/12 via-white to-brand-cyan/18 text-brand-blue">
          <Icon className="h-7 w-7" />
        </div>
        <span className="rounded-full border border-brand-blue/15 bg-brand-blue/8 px-3 py-1 text-xs font-semibold text-brand-blue">
          {course.highlight}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-muted sm:mt-6 sm:gap-4">
        <span className="inline-flex items-center gap-1">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {course.rating}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-4 w-4 text-brand-cyan" />
          {course.duration}
        </span>
        <span>{course.level}</span>
      </div>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{course.title}</h3>
      <p className="mt-3 text-sm leading-6 text-muted">{course.subtitle}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {course.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-7">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-muted-soft">Program Fee</div>
            <div className="mt-1 text-xl font-semibold text-foreground sm:text-2xl">{course.price}</div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-brand-cyan transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </div>
        <ButtonLink href="/contact" className="w-full">
          Enroll Now
        </ButtonLink>
      </div>
    </article>
  );
}
