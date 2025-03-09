import {ProductGrid} from '@/components/bestsellers/productgrid';
import FloatingCart from '@/components/cart/floatingcart';
import Hero from '@/components/home/hero';
import TestimonialCarousel from '@/components/testimonials/testimonialGrid';

import CakeCarousel from '@/components/work/cakeCarousel';
import {TestimonialProps} from '@/lib/types';

export default function Home() {
  const sampleTestimonials: TestimonialProps[] = [
    {
      name: 'John Doe',
      testimonial: 'Great product, excellent service!',
      imageUrl: '/path/to/image1.jpg',
    },
    {
      name: 'Jane Smith',
      testimonial: 'Really transformed my business.',
      imageUrl: '/path/to/image2.jpg',
    },
    {
      name: 'Bob Johnson',
      testimonial: 'Highly recommend to everyone!',
      imageUrl: '/path/to/image3.jpg',
    },
    {
      name: 'Alice Brown',
      testimonial: 'Fantastic experience all around.',
      imageUrl: '/path/to/image4.jpg',
    },
    {
      name: 'Alice Brown',
      testimonial: 'Fantastic experience all around.',
      imageUrl: '/path/to/image4.jpg',
    },
    {
      name: 'Alice Brown',
      testimonial: 'Fantastic experience all around.',
      imageUrl: '/path/to/image4.jpg',
    },
  ];
  return (
    <div className='flex flex-col '>
      <Hero />
      <ProductGrid />
      <FloatingCart />
      <CakeCarousel />
      <TestimonialCarousel testimonials={sampleTestimonials} />
    </div>
  );
}
