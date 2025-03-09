'use client';

import {useEffect, useState} from 'react';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Button} from '@/components/ui/button';
import {useCartStore} from '@/lib/cartStore';
import Button1 from '@/components/home/button1';
import {CartItem} from '@/lib/types';
import {useSession} from 'next-auth/react';
import {makeOrder} from '@/lib/actions/orders';
import OrderDialog from '@/components/cart/orderSuccess';
import {sendOrderEmail} from '@/lib/actions/sendMail';

export default function CheckoutPage() {
  const [showDialog, setShowDialog] = useState(false);
  const [orderId, setOrderId] = useState<string | undefined>('');
  const {items, updateQuantity, removeFromCart} = useCartStore();
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('payOnDelivery');
  const {data: session} = useSession();
  const clearCart = useCartStore((state) => state.clearCart);

  const handleCustomerDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCustomerDetails({...customerDetails, [e.target.name]: e.target.value});
  };

  const handleQuantityChange = (item: CartItem, newQuantity: number) => {
    if (newQuantity > 0) {
      updateQuantity(item.id, newQuantity);
    } else {
      removeFromCart(item.id);
    }
  };

  useEffect(() => {
    const resutl = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    setTotal(resutl);
  }, [items]);

  /*const calculateTotal = () => {
    const total = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return total;
  };*/

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const userId = session?.user?.id;

    if (!userId) {
      alert('User ID is missing. Please log in and try again.');
      return;
    }

    try {
      const orderPayload = {
        message,
        paymentMethod,
        customerDetails,
        userId,
        items: items.map((item) => ({
          ...item,
          description: item.description || '',
        })),
        total,
      };

      const response = await makeOrder(orderPayload);

      if (response.success && response.order?.id) {
        setOrderId(response.order.id.toString());
        setShowDialog(true);

        const emailPayload = {
          orderId: response.order.id,
          customerName: customerDetails.name,
          customerEmail: customerDetails.email,
          items,
          total,
        };

        const emailResponse = await sendOrderEmail(
          emailPayload,
          'orderReceived'
        );

        if (emailResponse.status === 200) {
        } else {
          console.warn(
            'Failed to send order confirmation email:',
            emailResponse.message
          );
        }

        clearCart();
      } else {
        alert('Failed to place order. Please try again.');
        console.warn('Order submission failed:', response);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert(
        'An unexpected error occurred while placing your order. Please try again later.'
      );
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-[#ffe7e7] to-pink-200 py5 md:py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='p-2 md:p-6 lg:p-8'>
          <h1 className='text-3xl font-bold mb-6 bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-800 inline-block text-transparent bg-clip-text'>
            Checkout
          </h1>
          <form onSubmit={handleSubmit} className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='space-y-6'>
                <div>
                  <h2 className='text-xl font-semibold mb-4 text-purple-800'>
                    Cart Items
                  </h2>
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className='flex justify-between items-center mb-2 text-slate-800 p-2'>
                      <span>{item.title}</span>

                      <div>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handleQuantityChange(item, item.quantity - 1)
                          }
                          className='text-purple-700 border-purple-700 hover:bg-purple-100'>
                          -
                        </Button>
                        <span className='mx-2'>{item.quantity}</span>
                        <Button
                          type='button'
                          variant='outline'
                          size='sm'
                          onClick={() =>
                            handleQuantityChange(item, item.quantity + 1)
                          }
                          className='text-purple-700 border-purple-700 hover:bg-purple-100'>
                          +
                        </Button>
                        <span className='ml-4 text-xs md:text-sm lg:text-base'>
                          Rs {item.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className='text-right font-bold mt-4 text-purple-900'>
                    Total: Rs {total}
                  </div>
                </div>
                <div>
                  <h2 className='text-xl font-semibold mb-4 text-purple-800'>
                    Customer Details
                  </h2>
                  <div className='space-y-4'>
                    <div>
                      <Label htmlFor='name' className='text-slate-800'>
                        Name
                      </Label>
                      <Input
                        id='name'
                        name='name'
                        value={customerDetails.name}
                        onChange={handleCustomerDetailsChange}
                        required
                        className='border-purple-300 focus:border-purple-500 focus:ring-purple-500'
                      />
                    </div>

                    <div>
                      <Label htmlFor='phone' className='text-slate-800'>
                        Phone
                      </Label>
                      <Input
                        id='phone'
                        name='phone'
                        type='tel'
                        value={customerDetails.phone}
                        onChange={handleCustomerDetailsChange}
                        required
                        className='border-purple-300 focus:border-purple-500 focus:ring-purple-500'
                      />
                    </div>
                    <div>
                      <Label htmlFor='email' className='text-slate-800'>
                        Email
                      </Label>
                      <Input
                        id='email'
                        name='email'
                        value={customerDetails.email}
                        onChange={handleCustomerDetailsChange}
                        required
                        className='border-purple-300 focus:border-purple-500 focus:ring-purple-500'
                      />
                    </div>
                    <div>
                      <Label htmlFor='address' className='text-slate-800'>
                        Address
                      </Label>
                      <Textarea
                        id='address'
                        name='address'
                        value={customerDetails.address}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            address: e.target.value,
                          })
                        }
                        required
                        className='border-purple-300 focus:border-purple-500 focus:ring-purple-500'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='space-y-6'>
                <div>
                  <h2 className='text-xl font-semibold mb-4 text-purple-800'>
                    Message for the Bakery
                  </h2>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder='Any special instructions or requests? Or Message on the cake'
                    className='border-purple-300 focus:border-purple-500 focus:ring-purple-500'
                  />
                </div>
                <div>
                  <h2 className='text-xl font-semibold mb-4 text-purple-800'>
                    Payment Method
                  </h2>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value='payOnDelivery'
                        id='payOnDelivery'
                        className='text-purple-700'
                      />
                      <Label htmlFor='payOnDelivery' className='text-slate-800'>
                        Pay on Delivery
                      </Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem
                        value='payOnline'
                        id='payOnline'
                        className='text-purple-700'
                      />
                      <Label htmlFor='payOnline' className='text-slate-800'>
                        Pay Online
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button1
                  type='submit'
                  className='w-full bg-purple-700 text-white hover:bg-purple-600'>
                  Place Order
                </Button1>
              </div>
            </div>
          </form>
          <OrderDialog
            open={showDialog}
            setOpen={setShowDialog}
            orderId={orderId}
          />
        </div>
      </div>
    </div>
  );
}
