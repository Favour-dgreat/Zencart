"use client";

import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
};



export default function Home({ products }: { products: Product[] }) {
  return (
    <>
   <section>
    <div className="mx-auto flex flex-row max-w-7xl items-center justify-between px-6 py-20">
        <div>
            <h1 className="text-4xl font-bold ">Welcome to Zencart</h1>
            <p className="mt-4 text-lg text-gray-600">Your one-stop shop for all things awesome. Discover a wide range of products at unbeatable prices.</p>
            <button className="mt-6 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Shop Now</button>
        </div>
        <div>
            <Card>
                <CardMedia
                    component="img"
                    className="w-96 h-96 object-cover"
                    image={products[1].image}
                    alt="Featured Product"
                />
            </Card>
        </div>
    </div>
   </section>
       
       <div className="flex justify-center ">
  <div className="bg-gradient-to-r from-indigo-400 to-blue-500 p-5 text-center w-50 text-white rounded-2xl">
    <button>Explore</button>
  </div>
</div>


    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="mb-10 text-3xl font-bold">Featured Products</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => (
            <Card key={product.id} variant="outlined" className="p-4">
              <CardMedia
                component="img"
                 className="w-20 object-cover h-60"
                image={product.image}
                alt={product.title}
              />
              <h3 className="font-semibold mt-2 line-clamp-1">{product.title}</h3>
              <p className="text-gray-600">${product.price}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
