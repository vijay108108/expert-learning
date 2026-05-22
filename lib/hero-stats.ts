import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type HeroStatItem = {
  value: string;
  label: string;
};

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);
}

export async function getHeroStats(): Promise<HeroStatItem[] | null> {
  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return null;
  }

  const [studentsResult, coursesResult, metricsResult] = await Promise.all([
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase.from("courses").select("id", { count: "exact", head: true }),
    supabase.from("site_metrics").select("placement_rate").limit(1).maybeSingle(),
  ]);

  if (studentsResult.error || coursesResult.error || metricsResult.error) {
    return null;
  }

  const studentsCount = studentsResult.count;
  const coursesCount = coursesResult.count;
  const placementRate = metricsResult.data?.placement_rate;

  if (typeof studentsCount !== "number" || typeof coursesCount !== "number" || typeof placementRate !== "number") {
    return null;
  }

  return [
    { value: formatCompactNumber(studentsCount), label: "Enrolled students" },
    { value: String(coursesCount), label: "Active courses" },
    { value: `${placementRate}%`, label: "Placement / success rate" },
  ];
}
