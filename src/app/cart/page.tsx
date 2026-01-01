"use client";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { useProductStore } from "@/Store/productStore";
import { useEffect } from "react";
import Loading from "../../Components/Loading";
import Error from "../../Components/Error";
import { Nav } from "@/Components/Nav";
import Footer from "@/Components/layout/footer";
import CategorySidebar from "@/Components/CategoriesSidebar";

export default function Cartpage(){
    const {products, fetchProducts, loading, error} = useProductStore();

    useEffect(()=>{
        fetchProducts();
    }, [fetchProducts]);

    if(loading){
        return <Loading />;
    }

    if(error){
        return <Error message={error} retry={fetchProducts} />;
    }

    if(products.length === 0){
        return <p className="text-center mt-10 text-lg">product unavailable.</p>;
    }

    return(
        <>
        <Nav />
        <CategorySidebar />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products.map((product, index)=>(
                <Card key={index} className="shadow-lg rounded-lg overflow-hidden">
                    <CardMedia
                        component="img"
                        
                        image={product.image}
                        alt={product.title}
                        className="object-cover h-60 w-full"
                    />
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-2">{product.title}</h2>
                        <p className="text-gray-700 mb-4">${product.price.toFixed(2)}</p>
                        
                    </div>
                </Card>
            ))}

        </div>
        <Footer />
        </>
    )
}

