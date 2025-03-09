'use client';
import React, {useEffect, useState} from 'react';
import {Plus, Minus, X, ChevronDown, ChevronUp} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useCartStore} from '@/lib/cartStore';
import {useSession} from 'next-auth/react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const FloatingCart = () => {
  const router = useRouter();
  const {items} = useCartStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const {data: session} = useSession();

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleCheckout = () => {
    if (session) {
      // User is logged in, proceed to checkout
      router.push('/checkout');
    } else {
      // User is not logged in, show login dialog
      setLoginDialogOpen(true);
    }
  };

  const handleLogin = () => {
    // Close the dialog and redirect to login page with a redirect back to checkout
    setLoginDialogOpen(false);
    router.push('/login?redirect=/checkout');
  };

  const toggleCartExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  const {removeFromCart, updateQuantity} = useCartStore();
  if (itemCount === 0) return null;

  if (!isHydrated) {
    return <div>Loading...</div>; // Show a loading state while hydrating
  }

  return (
    <>
      <div className='fixed bottom-0 left-0 right-0 z-50'>
        <div className='absolute inset-0 bg-gradient-to-t from-black/10 to-transparent' />

        <div className='relative bg-white border-t border-gray-400 shadow-lg'>
          <div className='max-w-7xl mx-auto p-2 md:p-4'>
            {/* Cart Header with Toggle */}
            <div className='flex items-center justify-between mb-2 md:mb-4'>
              <div className='flex items-center space-x-2'>
                <span className='text-sm md:text-base font-medium'>
                  {itemCount} items
                </span>
              </div>
              <div className='flex items-center space-x-4'>
                <span className='font-medium text-sm md:text-base'>
                  Total: Rs.{totalAmount.toFixed(2)}
                </span>
                <button
                  onClick={toggleCartExpansion}
                  className='p-1 hover:bg-gray-100 rounded-full'>
                  {isExpanded ? (
                    <ChevronDown className='h-7 w-7 text-violet-600' />
                  ) : (
                    <ChevronUp className='h-7 w-7 text-violet-600' />
                  )}
                </button>
              </div>
            </div>

            {/* Collapsible Content */}
            {isExpanded && (
              <>
                {/* Cart Items */}
                <div className='space-y-2 md:space-y-3 max-h-48 overflow-y-auto mb-2 md:mb-4'>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className='flex items-center justify-between bg-gray-50 p-2 rounded'>
                      <div className='flex-1'>
                        <p className='text-sm md:text-base font-medium'>
                          {item.title}
                        </p>
                        <p className='text-xs md:text-sm text-gray-600'>
                          Rs {item.price.toFixed(2)} each
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className='flex items-centers space-x-2 md:space-x-3'>
                        <div className='flex items-center space-x-1 md:space-x-2'>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className='p-1 hover:bg-gray-200 rounded'
                            disabled={item.quantity <= 1}>
                            <Minus className='h-4 w-4' />
                          </button>

                          <span className='w-8 text-center'>
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
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
                    onClick={handleCheckout}
                    className='bg-purple-800 hover:bg-purple-900 text-white px-6 py-2 
                          rounded-full font-medium transition-colors text-sm md:text-base'>
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Login Dialog */}
      <AlertDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              Please log in to your account to proceed with checkout.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleLogin}
              className='bg-purple-800 hover:bg-purple-900 text-white'>
              Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FloatingCart;
