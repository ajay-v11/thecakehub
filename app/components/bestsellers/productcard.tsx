'use client';

import {useState} from 'react';
import Image from 'next/image';
import {Heart} from 'lucide-react';
import {Button} from '@/app/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/app/components/ui/card';

interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  onAddToCart: () => void;
}

export function ProductCard({
  title,
  price,
  imageUrl,
  onAddToCart,
}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <Card className='overflow-hidden w-40 md:w-52 lg:w-64 '>
      <CardHeader className='p-0 space-y-0 relative'>
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-2 right-2 z-10 hover:bg-white/50 text-gray-700'
          onClick={() => setIsFavorite(!isFavorite)}>
          <Heart
            className={`w-3 h-3 md:w-5 md:h-5 ${
              isFavorite ? 'fill-purple-600 text-purple-600' : ''
            }`}
          />
        </Button>
        <div className=' h-40 w-40 md:h-52 md:w-52 lg:h-52 lg:w-64 bg-purple-400 relative '>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className='object-fill overflow-hidden'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      </CardHeader>
      <CardContent className='p-2 md:p-4'>
        <h3 className='text-sm md:text-base lg:text-base  mb-2 text-zinc-700'>
          {title}
        </h3>
      </CardContent>
      <CardFooter className=' p-2 md:px-4 pt-0 flex items-center justify-between'>
        <span className='text-sm md:text-base  font-semibold md:font-bold text-slate-600'>
          Rs.{price.toFixed(2)}
        </span>
        <Button
          className='bg-purple-600 hover:bg-purple-700 w-16 h-8 md:w-24 text-xs md:text-sm px-2 md:px-4'
          onClick={onAddToCart}>
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
