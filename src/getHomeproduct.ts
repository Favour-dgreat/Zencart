import { product } from "@/productType"
import axios from "axios";



export const getHomeProducts = async (): Promise<product[]> => {
    const res = await axios.get<product[]>("https://fakestoreapi.com/products");

  if (res.status !== 200) {
    throw new Error("Failed to fetch products");
  }

  return res.data as product[];
}