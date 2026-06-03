export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero skeleton */}
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="space-y-4 rounded-[24px] border border-[#F1F5F9] bg-[#F8FAFC] p-8">
          <div className="h-5 w-32 rounded-full bg-[#E2E8F0]" />
          <div className="h-8 w-3/4 rounded-xl bg-[#E2E8F0]" />
          <div className="h-8 w-1/2 rounded-xl bg-[#E2E8F0]" />
          <div className="h-4 w-full rounded-lg bg-[#F1F5F9]" />
          <div className="h-4 w-5/6 rounded-lg bg-[#F1F5F9]" />
          <div className="mt-4 flex gap-3">
            <div className="h-10 w-32 rounded-xl bg-[#E2E8F0]" />
            <div className="h-10 w-28 rounded-xl bg-[#F1F5F9]" />
          </div>
        </div>
        <div className="rounded-[24px] border border-[#F1F5F9] bg-[#F8FAFC] p-8">
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-full rounded-lg bg-[#E2E8F0]" style={{ width: `${90 - i * 8}%` }} />
            ))}
          </div>
          <div className="mt-6 h-11 w-full rounded-xl bg-[#E2E8F0]" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-[20px] border border-[#F1F5F9] bg-[#F8FAFC] p-6">
            <div className="h-10 w-10 rounded-xl bg-[#E2E8F0]" />
            <div className="mt-4 h-5 w-3/4 rounded-lg bg-[#E2E8F0]" />
            <div className="mt-3 space-y-2">
              <div className="h-3.5 w-full rounded bg-[#F1F5F9]" />
              <div className="h-3.5 w-5/6 rounded bg-[#F1F5F9]" />
              <div className="h-3.5 w-4/5 rounded bg-[#F1F5F9]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
