import {create} from "zustand";
import {persist} from "zustand/middleware";

interface CartItem {
    id:string;
    title:string;
    price:number;
    image:string;
    quantity:number;
}

type cartstore ={
    items: CartItem[];
    aaddItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  increase: (id: string) => void;
  decrease: (id: string) => void;
  clearCart: () => void;
}

export const useCartStore = create<cartstore>()(
    
)