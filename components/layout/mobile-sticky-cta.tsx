"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ButtonLink } from "@/components/ui/button-link";

export function MobileStickyCta() {
  const pathname = usePathname();
  const { user } = useAuth();
  const workshopPath = "/workshops/ai-developer-launch-lab";
  const onWorkshopPage = pathname.startsWith(workshopPath);
  const workshopCheckoutHref = "/checkout/ai-developer-launch-lab";
  const workshopAuthHref = `/signup?redirect=${encodeURIComponent(workshopCheckoutHref)}`;
  const href = onWorkshopPage
    ? (user ? workshopCheckoutHref : workshopAuthHref)
    : "/programs";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-blue/15 bg-white/96 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] shadow-[0_-8px_20px_rgba(0,45,122,0.08)] backdrop-blur md:hidden">
      <ButtonLink href={href} variant="amber" className="w-full">
        {onWorkshopPage ? "Reserve My Seat - Rs. 999" : "Explore Programs"}
      </ButtonLink>
    </div>
  );
}
