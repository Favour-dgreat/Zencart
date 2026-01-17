"use client"

import { useState,useEffect } from "react";
import axios from "axios";
import Image from "next/image";
import Error from "@/Components/Error";


export default function OrderPage() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        async function fetchOrders() {
            try{
                const response = await axios.get('/api/orders');
                setOrders(response.data);

            } catch (error) {
             console.error("Failed to fetch orders:", error);
             <Error message="Failed to load orders." />;
            }
        }
        fetchOrders();
    }, []);

 async function handlePay(order: any) {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: order.items.map((i: any) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    }),
  });

  const data = await res.json();
  window.location.href = data.url;
}


    return (
        <div>
            <h1>Your Orders</h1>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <ul>
                    {orders.map((order: any) => (
                        <li key={order.id}>
                            <p>Order ID: {order.id}</p>
                            <p>Total: ${order.total}</p>
                            <p>Status: {order.status}</p>
                            <Image src={order.imageUrl} alt="Order Image" width={200} height={200} />
                            <h4>Items:</h4>
                            <ul>
                                {order.items.map((item: any) => (
                                    <li key={item.id}>
                                        Product ID: {item.productId}, Quantity: {item.quantity}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}
            <button className="bg-green-500 text-2xl" onClick={() => handlePay(orders[0])}>Pay First Order</button>
        </div>
    );
}