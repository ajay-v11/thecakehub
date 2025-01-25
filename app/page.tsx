import {ProductGrid} from '@/components/bestsellers/productgrid';
import FloatingCart from '@/components/cart/floatingcart';
import Hero from '@/components/home/hero';

export default function Home() {
  return (
    <>
      <Hero />
      <ProductGrid />
      <FloatingCart />
    </>
  );
}
