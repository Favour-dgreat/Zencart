import { Nav } from "@/Components/Nav";
import { getHomeProducts } from "@/getHomeproduct";
import Home from "@/app/home/page";
import Footer from "@/Components/layout/footer";


export default async function Page() {
  const products = await getHomeProducts();
  return (
    <>
      <Nav/>
      <Home products={products}/>
      <Footer/>
    </>
  );
}
