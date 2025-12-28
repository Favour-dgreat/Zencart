import productType from "./productType"; 
import axios from "axios";

export const getHomeProducts = async (): Promise<productType[]> => {
    const res = await axios.get<productType[]>("https://fakestoreapi.com/products");

  if (res.status !== 200) {
    throw new Error("Failed to fetch products");
  }

  return res.data as productType[];
}