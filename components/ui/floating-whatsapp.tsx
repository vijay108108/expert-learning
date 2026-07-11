import { MessageCircleMore } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

export function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      className="fixed right-6 bottom-24 z-50 inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_12px_rgba(37,211,102,0.4)] transition hover:-translate-y-1 md:bottom-6"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircleMore className="h-6 w-6" />
    </a>
  );
}
