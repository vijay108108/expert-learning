"use client";

import { CalendarDays, Clock3, Globe, Rocket } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CourseEnrollmentAction } from "@/components/enroll/course-enrollment-action";
import { LaunchLabWorkshopExperience } from "@/components/lms/launch-lab-workshop-experience";
import { useAuth } from "@/hooks/use-auth";
import { trackWorkshopViewContent } from "@/lib/client-analytics";
import { getWorkshopConfigBySlug, type WorkshopConfig } from "@/lib/firebase";

type CountdownState = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  ended: boolean;
};

const defaultWorkshopStartIso = "2026-07-23T19:17:00+05:30";
const defaultWorkshopEndIso = "2026-07-23T21:17:00+05:30";
const defaultWorkshopFeeLabel = "Rs. 999";

function buildCountdown(nowMs: number, targetMs: number): CountdownState {
  const diff = Math.max(0, targetMs - nowMs);
  const ended = diff === 0;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, ended };
}

function CountdownTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 px-3 py-2 text-center backdrop-blur-xl sm:px-4 sm:py-3">
      <p className="text-xl font-bold tracking-tight text-white sm:text-2xl">{String(value).padStart(2, "0")}</p>
      <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-white/65">{label}</p>
    </div>
  );
}

export function AiDeveloperLaunchLabPage({
  initialWorkshopConfig = null,
}: {
  initialWorkshopConfig?: WorkshopConfig | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthReady } = useAuth();
  const [now, setNow] = useState<number | null>(null);
  const [workshopConfig, setWorkshopConfig] = useState<WorkshopConfig | null>(initialWorkshopConfig);

  useEffect(() => {
    trackWorkshopViewContent();
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      try {
        const config = await getWorkshopConfigBySlug("ai-developer-launch-lab");
        setWorkshopConfig(config);
      } catch {
        setWorkshopConfig(null);
      }
    }, 0);

    return () => window.clearTimeout(timer);
  }, [initialWorkshopConfig]);

  useEffect(() => {
    const shouldAutoCheckout = searchParams.get("autocheckout") === "1";

    if (!shouldAutoCheckout || !isAuthReady || !user) {
      return;
    }

    router.replace("/checkout/ai-developer-launch-lab");
  }, [isAuthReady, router, searchParams, user]);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const kickoff = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, 1000);

    return () => {
      window.clearTimeout(kickoff);
      window.clearInterval(timer);
    };
  }, []);

  const workshopStatus = workshopConfig?.status || "published";
  const workshopCapacity = workshopConfig?.capacity || 500;
  const workshopStartDate = new Date(defaultWorkshopStartIso);
  const workshopEndDate = new Date(defaultWorkshopEndIso);
  const workshopDayLabel = Number.isNaN(workshopStartDate.getTime())
    ? "Thursday (Guruvar)"
    : `${new Intl.DateTimeFormat("en-IN", { weekday: "long", timeZone: "Asia/Kolkata" }).format(workshopStartDate)} (Guruvar)`;
  const workshopDateLabel = Number.isNaN(workshopStartDate.getTime())
    ? "23 July 2026"
    : new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    }).format(workshopStartDate);
  const workshopTimeLabel = Number.isNaN(workshopStartDate.getTime()) || Number.isNaN(workshopEndDate.getTime())
    ? "7:17 PM - 9:17 PM IST"
    : `${new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(workshopStartDate)} - ${new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" }).format(workshopEndDate)} IST`;

  const countdownTarget = Number.isNaN(workshopStartDate.getTime())
    ? new Date(defaultWorkshopStartIso).getTime()
    : workshopStartDate.getTime();
  const countdown = useMemo(() => (now === null ? null : buildCountdown(now, countdownTarget)), [countdownTarget, now]);
  const isWorkshopPublished = workshopStatus === "published";

  return (
    <div className="bg-[#050816] text-white">
      <section className="relative overflow-hidden px-4 pb-12 pt-8 sm:px-6 lg:px-8 lg:pb-16 lg:pt-12">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,rgba(29,124,255,0.26),transparent_35%),radial-gradient(circle_at_82%_9%,rgba(255,122,0,0.22),transparent_30%),radial-gradient(circle_at_50%_88%,rgba(29,124,255,0.17),transparent_35%)]" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl gap-7 rounded-3xl border border-white/12 bg-white/5 p-5 backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1D7CFF]/40 bg-[#1D7CFF]/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8CC3FF]">
              <Rocket className="h-3.5 w-3.5" />
              Live Workshop
            </span>

            <h1 className="mt-4 text-[34px] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-[44px]">
              AI Developer Launch Lab Workshop
            </h1>
            <p className="mt-3 text-[15px] font-medium text-[#D6E4FF] sm:text-[17px]">
              Build, Deploy & Launch Your First AI Web Application on Microsoft Azure
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#CED7F0]">
              Welcome to the AI Developer Launch Lab. In this hands-on workshop, you will learn how professional developers use Claude AI to build modern web applications and deploy them live on Microsoft Azure.
              By the end of this workshop, you will have a production-ready AI web application running in the cloud.
            </p>

            <div className="mt-6 flex flex-wrap gap-2.5 text-[12px] text-[#A9B6DA]">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5"><CalendarDays className="h-3.5 w-3.5" />{workshopDayLabel}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5"><CalendarDays className="h-3.5 w-3.5" />{workshopDateLabel}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5"><Clock3 className="h-3.5 w-3.5" />{workshopTimeLabel}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/5 px-3 py-1.5"><Globe className="h-3.5 w-3.5" />Live Online</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FF7A00]/40 bg-[#FF7A00]/15 px-3 py-1.5 font-semibold text-[#FFC48C]">Limited-time offer: {defaultWorkshopFeeLabel}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22C55E]/35 bg-[#22C55E]/15 px-3 py-1.5 font-semibold text-[#BBF7D0]">Seats: {workshopCapacity}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-xl sm:p-5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[#9CB4E8]">Workshop Starts In</p>
            <div className="mt-3 grid grid-cols-4 gap-2">
              <CountdownTile label="Days" value={countdown?.days ?? 0} />
              <CountdownTile label="Hours" value={countdown?.hours ?? 0} />
              <CountdownTile label="Mins" value={countdown?.minutes ?? 0} />
              <CountdownTile label="Secs" value={countdown?.seconds ?? 0} />
            </div>
            {countdown?.ended ? (
              <p className="mt-3 text-sm font-semibold text-[#7DF5A4]">We are live now. Secure your seat and join instantly.</p>
            ) : null}

            <div className="mt-5">
              {isWorkshopPublished ? (
                <CourseEnrollmentAction
                  courseSlug="ai-developer-launch-lab"
                  checkoutLabel={`Reserve Builder Seat - ${defaultWorkshopFeeLabel}`}
                  checkoutButtonClassName="h-12 w-full rounded-xl border border-[#FF7A00]/40 bg-[linear-gradient(135deg,#FF7A00,#FF9A3C)] px-5 text-[14px] text-[#1E1408] shadow-[0_16px_34px_rgba(255,122,0,0.32)]"
                  helperClassName="hidden"
                />
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 text-[14px] font-semibold text-[#94A3B8]"
                >
                  Registrations Paused ({workshopStatus})
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <LaunchLabWorkshopExperience
        courseName="AI Developer Launch Lab Workshop"
        completedLessons={0}
        totalLessons={0}
        progressPercent={0}
        resources={[]}
        showProgress={false}
        finalCtaHref="/checkout/ai-developer-launch-lab"
        finalCtaLabel={`Reserve Your Seat - ${defaultWorkshopFeeLabel}`}
      />
    </div>
  );
}
