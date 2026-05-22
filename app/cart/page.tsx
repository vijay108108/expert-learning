import { ProtectedRouteGuard } from "@/components/auth/protected-route-guard";
import { CartPage } from "@/components/cart/cart-page";

export default function ShoppingCartPage() {
  return (
    <ProtectedRouteGuard>
      <CartPage />
    </ProtectedRouteGuard>
  );
}
