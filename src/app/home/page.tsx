import { getHomeProducts } from "@/getHomeproduct";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";

export default async function Home() {
  const products = await getHomeProducts();

  if (!products.length) {
    return <div className="p-6">No products available.</div>;
  }

  return (
    <>
      <section>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-20">
          <div>
            <h1 className="text-4xl font-bold">Welcome to Zencart</h1>
            <p className="mt-4 text-lg text-gray-600">
              Your one-stop shop for all things awesome.
            </p>
          </div>

          <Card>
            <CardMedia
              component="img"
              className="w-96 h-96 object-cover"
              image={products[1]?.image ?? "/placeholder.png"}
              alt="Featured Product"
            />
          </Card>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-10 text-3xl font-bold">Featured Products</h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <Card key={product.id} className="p-4">
                <CardMedia
                  component="img"
                  className="h-60 object-cover"
                  image={product.image}
                  alt={product.title}
                />
                <h3 className="mt-2 font-semibold line-clamp-1">
                  {product.title}
                </h3>
                <p>${product.price}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}