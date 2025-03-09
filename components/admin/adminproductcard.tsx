import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import {Button} from '../ui/button';
import {Trash2} from 'lucide-react';
import {Product} from '@/lib/types';

interface AdminProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

export const AdminProductCard: React.FC<AdminProductCardProps> = ({
  product,
  onDelete,
}) => {
  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
      <div className='relative h-48 overflow-hidden'>
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={70}
          height={80}
          className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
        />
        <div className='absolute top-2 right-2'>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant='destructive'
                size='icon'
                className='rounded-full'>
                <Trash2 className='h-4 w-4' />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete {product.title}. This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(product.id)}
                  className='bg-red-500 hover:bg-red-600'>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
      <div className='p-4 space-y-2'>
        <h3 className='text-lg font-semibold text-gray-800 truncate'>
          {product.title}
        </h3>
        <div className='flex justify-between items-center'>
          <span className='text-sm font-medium text-purple-600'>
            {product.category}
          </span>
          <span className='text-sm font-bold text-gray-700'>
            ₹{product.price}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full'>
            ID: {product.id}
          </span>
        </div>
      </div>
    </div>
  );
};
