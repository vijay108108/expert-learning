import { ButtonLink } from "@/components/ui/button-link";

export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface-strong/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] backdrop-blur md:hidden">
      <ButtonLink href="/contact" className="w-full">
        Apply Now
      </ButtonLink>
    </div>
  );
}
