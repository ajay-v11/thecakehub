'use client';

import React, {useState} from 'react';
import Image from 'next/image';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import OrderDialog from '@/components/cart/orderSuccess';
import {useSession} from 'next-auth/react';
import {makeCustomOrder} from '@/lib/actions/orders';
import {sendCustomOrderEmail} from '@/lib/actions/sendMail';

const cakeTemplates = [
  {
    id: 1,
    name: 'Classic Birthday',
    src: '/cakes/classic-birthday.jpg',
    alt: 'Classic birthday cake with candles',
  },
  {
    id: 2,
    name: 'Chocolate Delight',
    src: '/cakes/chocolate-delight.jpg',
    alt: 'Rich chocolate cake with ganache',
  },
  {
    id: 3,
    name: 'Vanilla Dream',
    src: '/cakes/vanilla-dream.jpg',
    alt: 'Elegant vanilla cake with buttercream',
  },
  {
    id: 4,
    name: 'Fruit Fusion',
    src: '/cakes/fruit-fusion.jpg',
    alt: 'Fruity cake with fresh berries',
  },
];

export default function CustomCakeForm() {
  const [showDialog, setShowDialog] = useState(false);
  const [customOrderId, setCustomOrderId] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [customImage, setCustomImage] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [cakeDescription, setCakeDescription] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });
  const {data: session} = useSession();

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomImage(file);
      setSelectedTemplate(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setCustomImage(null);
    setImagePreview(null);
  };

  // Handle customer details change
  const handleCustomerDetailsChange = (e) => {
    const {name, value} = e.target;
    setCustomerDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = session?.user?.id;

    try {
      // Convert the image file to a format that can be sent to the server
      let imageData = null;
      if (customImage) {
        imageData = customImage;
      }

      const response = await makeCustomOrder({
        cakeDescription,
        customerDetails,
        userId,
        customImage: imageData,
        selectedTemplate,
      });

      if (response.success) {
        setCustomOrderId(response.customOrder?.id); // Set ID, not userId

        // Create email payload for custom order
        const emailPayload = {
          orderId: response.customOrder?.id,
          customerName: response.customOrder?.customerName,
          customerEmail: response.customOrder?.customerEmail, // This was incorrect - using customerName instead of customerEmail
          description: response.customOrder?.description,
        };

        // Update to use 'customOrderReceived' email type
        const emailResponse = await sendCustomOrderEmail(
          emailPayload,
          'customOrderConfirmed' // No 'orderReceived' template exists for custom orders in your implementation
        );

        if (emailResponse.status === 200) {
        } else {
          console.warn(
            'Failed to send order confirmation email:',
            emailResponse.message
          );
        }
        setShowDialog(true);
      } else {
        // Handle error
        console.error('Error submitting order:', response.error);
        alert('Failed to submit your custom cake request. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting order', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-[#ffe7e7] to-pink-200 py-5 md:py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden'>
        <div className='p-2 md:p-6 lg:p-8'>
          <h1 className='text-3xl font-bold mb-6 bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-800 inline-block text-transparent bg-clip-text'>
            Custom Cake Request
          </h1>

          <form onSubmit={handleSubmit} className='space-y-8'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              {/* Left Column */}
              <div className='space-y-6'>
                <div>
                  <h2 className='text-xl font-semibold mb-4 text-purple-800'>
                    Design Your Cake
                  </h2>

                  <div className='mb-4'>
                    <Label
                      htmlFor='cakeDescription'
                      className='text-slate-800 mb-2 block'>
                      Describe your dream cake
                    </Label>
                    <Textarea
                      id='cakeDescription'
                      value={cakeDescription}
                      onChange={(e) => setCakeDescription(e.target.value)}
                      placeholder='Please describe the cake you want - flavor, size, occasion, special requests...'
                      className='border-purple-300 focus:border-purple-500 focus:ring-purple-500 min-h-32'
                    />
                  </div>

                  <div className='mb-4'>
                    <p className='text-slate-800 mb-2 font-medium'>
                      Select a template or upload your own design
                    </p>

                    <div className='grid grid-cols-2 gap-3 mb-4'>
                      {cakeTemplates.map((template) => (
                        <div
                          key={template.id}
                          className={`border rounded-lg p-2 cursor-pointer transition ${
                            selectedTemplate?.id === template.id
                              ? 'border-purple-500 ring-2 ring-purple-300'
                              : 'border-slate-200 hover:border-purple-200'
                          }`}
                          onClick={() => handleTemplateSelect(template)}>
                          <div className='relative h-32 w-full mb-2'>
                            <div className='bg-slate-100 h-full w-full flex items-center justify-center'>
                              {/* In a real app, replace this with actual images */}
                              <div className='text-sm text-slate-600'>
                                [{template.name}]
                              </div>
                            </div>
                          </div>
                          <p className='text-xs text-center text-slate-800'>
                            {template.name}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className='mt-4'>
                      <p className='text-slate-800 mb-2 text-sm'>
                        Or upload your own design
                      </p>
                      <Input
                        id='customImage'
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                        className='border-purple-300 focus:border-purple-500 focus:ring-purple-500'
                      />

                      {imagePreview && (
                        <div className='mt-4 border rounded-lg p-2'>
                          <p className='text-sm text-slate-700 mb-2'>
                            Your uploaded design:
                          </p>
                          <div className='relative h-48 w-full'>
                            <Image
                              src={imagePreview}
                              alt='Custom cake design'
                              className='object-contain h-full w-full'
                              fill={true}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className='space-y-6'>
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
                        type='email'
                        value={customerDetails.email}
                        onChange={handleCustomerDetailsChange}
                        required
                        className='border-purple-300 focus:border-purple-500 focus:ring-purple-500'
                      />
                    </div>

                    <div>
                      <Label htmlFor='address' className='text-slate-800'>
                        Delivery Address
                      </Label>
                      <Textarea
                        id='address'
                        name='address'
                        value={customerDetails.address}
                        onChange={handleCustomerDetailsChange}
                        required
                        className='border-purple-300 focus:border-purple-500 focus:ring-purple-500'
                      />
                    </div>
                  </div>
                </div>

                <div className='mt-8'>
                  <Button
                    type='submit'
                    className='w-full bg-purple-500 hover:bg-purple-700 text-white py-2 px-4 rounded-md'>
                    Send Cake Request
                  </Button>
                  <p className='text-xs text-slate-600 mt-2 text-center'>
                    We'll contact you to confirm details and pricing as soon as
                    possible hours.
                  </p>
                </div>
              </div>
            </div>
          </form>
          <OrderDialog
            open={showDialog}
            setOpen={setShowDialog}
            orderId={customOrderId}
          />
        </div>
      </div>
    </div>
  );
}
