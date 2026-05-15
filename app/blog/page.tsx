import { ArrowUpRight } from "lucide-react";
import { buildMetadata } from "@/lib/metadata";
import { blogHighlights } from "@/data/site";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/ui/reveal";

export const metadata = buildMetadata({
  title: "Blog | Expert Learning",
  description:
    "Insights, career advice, and learning strategy for cloud, AI, and DevOps professionals.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Insights for learners building modern cloud and AI careers"
        description="A curated content space for certification strategy, portfolio thinking, hiring trends, and applied technology guidance."
      />
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {blogHighlights.map((article, index) => (
            <Reveal key={article.title} delay={index * 0.06}>
              <article className="group flex h-full flex-col rounded-[30px] border border-border bg-card p-7 shadow-soft transition hover:-translate-y-1 hover:border-brand-blue/30">
                <div className="inline-flex w-fit rounded-full border border-brand-blue/15 bg-brand-blue/8 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue">
                  {article.category}
                </div>
                <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                  {article.title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted">{article.excerpt}</p>
                <div className="mt-auto pt-8 text-sm font-semibold text-brand-blue">
                  Read article
                  <ArrowUpRight className="ml-2 inline h-4 w-4 transition group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
