import {create} from "zustand";
import axios from "axios";

export type product = {
    id:string;
    title:string;
    price:number;
    image:string;
    description:string;
    category:string;
}

type productstate = {
    products: product[];
    loading: boolean;
    error : string | null;
    fetchProducts: () => Promise<void>;

}


export const useProductStore = create<productstate>((set)=>({
    products: [],
    loading: false,
    error: null,
    fetchProducts:  async () => {
        set({loading:true,error:null});
        try{
            const res = await axios.get<product[]>("/api/products");
            if(!res.ok) throw new Error("Failed to fetch products");
            set({products: res.data, loading:false});
        }catch (error:any){
            set({error: error.message, loading:false});
        }
    }
}))