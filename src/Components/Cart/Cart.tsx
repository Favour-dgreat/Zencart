import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { useProductStore } from "@/Store/productStore";
import { useEffect } from "react";

export default function cart(){
    const {products, fetchProducts, loading, error} = useProductStore();

    useEffect(()=>{
        fetchProducts();
    }, [fetchProducts]);
}

