"use client";

import { IconShoppingCart } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";

export function AddToCartButton({
  courseSlug,
  className,
  label = "Purchase Course",
}: {
  courseSlug: string;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthReady, openAuthModal, user } = useAuth();
  const { addCourse, hasCourse } = useCart();
  const inCart = hasCourse(courseSlug);

  function completePurchase() {
    addCourse(courseSlug);
    router.push("/cart");
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (!isAuthReady) {
          return;
        }

        if (!user) {
          openAuthModal("signup", pathname, async () => {
            completePurchase();
          });
          return;
        }

        completePurchase();
      }}
      className={cn(className)}
    >
      <IconShoppingCart size={14} />
      {inCart ? "Purchase" : label}
    </button>
  );
}
