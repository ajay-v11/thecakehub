'use client';
import {useState} from 'react';
import {ProductCard} from '@/components/bestsellers/productcard';
import {Product} from '@/lib/types';
import {useCartStore} from '@/lib/cartStore';
import FloatingCart from '@/components/cart/floatingcart';

const PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Chocolate cake',
    description: 'Rich chocolate cake with dark chocolate ganache',
    price: 55.0,
    imageUrl: '/placeholder.svg?height=300&width=400',
    category: 'Cakes',
  },
  {
    id: 2,
    title: 'Red velvet cake',
    description: 'Classic red velvet with cream cheese frosting',
    price: 60.0,
    imageUrl: '/placeholder.svg?height=300&width=400',
    category: 'Cakes',
  },
  {
    id: 3,
    title: 'Chicken puff',
    description: 'Flaky pastry filled with seasoned chicken',
    price: 25.0,
    imageUrl: '/placeholder.svg?height=300&width=400',
    category: 'Puffs',
  },
  {
    id: 4,
    title: 'Vegetable puff',
    description: 'Crispy puff pastry with mixed vegetables',
    price: 20.0,
    imageUrl: '/placeholder.svg?height=300&width=400',
    category: 'Puffs',
  },
  {
    id: 5,
    title: 'Fruit tart',
    description: 'Fresh seasonal fruits on vanilla custard',
    price: 40.0,
    imageUrl: '/placeholder.svg?height=300&width=400',
    category: 'Tarts',
  },
  {
    id: 6,
    title: 'Vanilla bean tart',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    price: 45.9,
    imageUrl: '/placeholder.svg?height=300&width=400',
    category: 'Tarts',
  },
  {
    id: 7,
    title: 'Chocolate cake',
    description: 'Rich chocolate cake with dark chocolate ganache',
    price: 55.0,
    imageUrl: '/placeholder.svg?height=300&width=400',
    category: 'Cakes',
  },
  {
    id: 8,
    title: 'Red velvet cake',
    description: 'Classic red velvet with cream cheese frosting',
    price: 60.0,
    imageUrl: '/placeholder.svg?height=300&width=400',
    category: 'Cakes',
  },
  {
    id: 9,
    title: 'Chocolate cake',
    description: 'Rich chocolate cake with dark chocolate ganache',
    price: 55.0,
    imageUrl: '/placeholder.svg?height=300&width=400',
    category: 'Cakes',
  },
  {
    id: 10,
    title: 'Red velvet cake',
    description: 'Classic red velvet with cream cheese frosting',
    price: 60.0,
    imageUrl: '/placeholder.svg?height=300&width=400',
    category: 'Cakes',
  },
  // ... rest of your products array stays the same
];

export default function Shop() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', 'Cakes', 'Puffs', 'Tarts'];

  const addToCart = useCartStore((state) => state.addToCart);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const filteredProducts =
    selectedCategory === 'All'
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.category === selectedCategory);

  return (
    <div className='space-y-12 px-5 md:px-10 lg:px-20 pt-7 md:pt-12 lg:pt-16'>
      <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
        <h1 className='text-lg md:text-2xl lg:text-4xl font-bold text-purple-800'>
          OUR PRODUCTS
        </h1>
        <CategoryNav
          categories={categories}
          onCategoryClick={handleCategoryChange}
        />
      </div>

      <div className='space-y-6'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
              onAddToCart={() => addToCart(product)}
            />
          ))}
        </div>
      </div>
      <FloatingCart />
    </div>
  );
}

const CategoryNav = ({
  categories,
  onCategoryClick,
}: {
  categories: string[];
  onCategoryClick: (category: string) => void;
}) => {
  return (
    <div className='flex gap-2 overflow-x-auto'>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryClick(category)}
          className='px-4 py-2 rounded-full border-1 border-purple-800 
                      text-purple-800 hover:bg-purple-300 font-medium 
                      whitespace-nowrap transition-colors duration-200 bg-purple-100 hover:text-purple-900 hover:scale-90'>
          {category}
        </button>
      ))}
    </div>
  );
};
