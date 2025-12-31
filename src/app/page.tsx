import { Nav } from "@/Components/Nav";
import { getHomeProducts } from "@/getHomeproduct";
import Home from "@/Components/Home/Home";
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
