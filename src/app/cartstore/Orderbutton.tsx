"use client";

import { useCartStore } from "@/Store/cartStore";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function OrderButton() {
  const cartitems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const router = useRouter();

 const handleOrder = async () => {
  try {
    // 1️⃣ Create order
    const orderRes = await axios.post("/api/orders", {
      items: cartitems,
    });

    const orderId = orderRes.data.orderId;

    // 2️⃣ Pay for order
    const stripeRes = await axios.post("/api/stripe/checkout", {
      orderId,
    });

    window.location.href = stripeRes.data.url;
  } catch (err) {
    console.error("Order failed:", err);
  }

  clearCart();
};


  return (
    <Button
      variant="contained"
      startIcon={<ShoppingCartIcon />}
      onClick={handleOrder}
      disabled={cartitems.length === 0}
    >
      Place Order
    </Button>
  );
}
