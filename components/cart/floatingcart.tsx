'use client';
import React from 'react';
import {ShoppingCart, Plus, Minus, X} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useCartStore} from '@/lib/cartStore';

const FloatingCart = () => {
  const router = useRouter();
  const {items} = useCartStore();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const {removeFromCart, updateQuantity} = useCartStore();
  if (itemCount === 0) return null;

  return (
    <div className='fixed bottom-0 left-0 right-0 z-50'>
      <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent' />

      <div className='relative bg-white border-t border-gray-200 shadow-lg'>
        <div className='max-w-7xl mx-auto p-4'>
          {/* Cart Header */}
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center space-x-2'>
              <ShoppingCart className='h-6 w-6 text-purple-800' />
              <span className='font-medium'>{itemCount} items</span>
            </div>
            <span className='font-medium'>
              Total: Rs.{totalAmount.toFixed(2)}
            </span>
          </div>

          {/* Cart Items */}
          <div className='space-y-3 max-h-48 overflow-y-auto mb-4'>
            {items.map((item) => (
              <div
                key={item.id}
                className='flex items-center justify-between bg-gray-50 p-2 rounded'>
                <div className='flex-1'>
                  <p className='font-medium'>{item.title}</p>
                  <p className='text-sm text-gray-600'>
                    Rs {item.price.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className='flex items-center space-x-3'>
                  <div className='flex items-center space-x-2'>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className='p-1 hover:bg-gray-200 rounded'
                      disabled={item.quantity <= 1}>
                      <Minus className='h-4 w-4' />
                    </button>

                    <span className='w-8 text-center'>{item.quantity}</span>

                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className='p-1 hover:bg-gray-200 rounded'>
                      <Plus className='h-4 w-4' />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className='p-1 hover:bg-gray-200 rounded text-red-500'>
                    <X className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className='flex justify-end space-x-4'>
            <button
              onClick={handleCartClick}
              className='text-purple-800 hover:text-purple-900 font-medium'>
              View Cart
            </button>
            <button
              onClick={handleCheckout}
              className='bg-purple-800 hover:bg-purple-900 text-white px-6 py-2 
                       rounded-full font-medium transition-colors'>
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCart;
