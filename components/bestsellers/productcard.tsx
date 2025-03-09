'use client';
import {useState} from 'react';
import Image from 'next/image';
import {Heart} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardFooter, CardHeader} from '@/components/ui/card';

interface ProductCardProps {
  title: string;
  description?: string | null;
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
    <Card className='overflow-hidden h-full w-full transition-shadow hover:shadow-md'>
      <CardHeader className='p-0 space-y-0 relative'>
        <Button
          variant='ghost'
          size='icon'
          className='absolute top-2 right-2 z-10 hover:bg-white/50 text-gray-700'
          onClick={() => setIsFavorite(!isFavorite)}>
          <Heart
            className={`w-4 h-4 md:w-5 md:h-5 ${
              isFavorite ? 'fill-purple-600 text-purple-600' : ''
            }`}
          />
        </Button>
        <div className='relative aspect-square w-full bg-gray-100'>
          <Image
            src={imageUrl}
            alt={title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw'
            priority
          />
        </div>
      </CardHeader>
      <CardContent className='p-3 md:p-4'>
        <h3 className='text-sm md:text-base font-medium line-clamp-2 text-zinc-700'>
          {title}
        </h3>
      </CardContent>
      <CardFooter className='p-3 md:p-4 pt-0 flex items-center justify-between'>
        <span className='text-sm md:text-base font-semibold text-slate-600'>
          Rs.{price.toFixed(2)}
        </span>
        <Button
          className='bg-purple-600 hover:bg-purple-700 h-8 px-3 md:px-4 text-xs md:text-sm'
          onClick={onAddToCart}>
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
