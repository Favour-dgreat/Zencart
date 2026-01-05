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
            const res = await axios.post(
                '/api/orders',
                { items: cartitems },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            if (res.status < 200 || res.status >= 300) {
                throw new Error('Failed to place order');
            }

            clearCart();
            router.push('/order');
        } catch (error) {
            console.error('Order error:', error);
            
        }
    }

    return (
        <Button variant="contained" startIcon={<ShoppingCartIcon />} onClick={handleOrder}>
            Place Order
        </Button>
    );
}