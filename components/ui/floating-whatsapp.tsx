import { MessageCircleMore } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}?text=Hi%20Expert%20Learning%2C%20I%20want%20career%20guidance.`}
      target="_blank"
      rel="noreferrer"
      className="fixed right-5 bottom-24 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-500/30 transition hover:-translate-y-1 md:bottom-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircleMore className="h-6 w-6" />
    </a>
  );
}
