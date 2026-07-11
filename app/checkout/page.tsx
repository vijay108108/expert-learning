import { ProtectedRouteGuard } from "@/components/auth/protected-route-guard";
import { CartCheckoutForm } from "@/components/cart/cart-checkout-form";

export default function CheckoutPage() {
  return (
    <ProtectedRouteGuard>
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6">
            <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#0B2E6B]">Checkout</div>
            <h1 className="mt-2 text-[30px] font-bold text-white">Secure your enrollment details</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#CBD5E1]">
              Verify your account information, optionally add GST details, and continue with Razorpay to complete payment.
            </p>
          </div>
          <CartCheckoutForm />
        </div>
      </section>
    </ProtectedRouteGuard>
  );
}
