function LoadingBlock({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-3xl bg-slate-200/70 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-32 sm:px-6 lg:px-8">
      <LoadingBlock className="h-14 w-48" />
      <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <LoadingBlock className="h-[420px]" />
        <LoadingBlock className="h-[420px]" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <LoadingBlock key={index} className="h-56" />
        ))}
      </div>
    </div>
  );
}
