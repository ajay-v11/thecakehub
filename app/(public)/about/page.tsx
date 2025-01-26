import Image from 'next/image';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';

const stores = [
  {
    name: 'Downtown Delights',
    address: '123 Main St, Cityville, State 12345',
    phone: '(555) 123-4567',
    email: 'downtown@sweetmoments.com',
  },
  {
    name: 'Suburban Sweets',
    address: '456 Oak Ave, Townsburg, State 67890',
    phone: '(555) 987-6543',
    email: 'suburban@sweetmoments.com',
  },
];

export default function AboutContactPage() {
  return (
    <div className='min-h-screen bg-gradient-to-b from-white via-[#ffe7e7] to-pink-200 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6 bg-gradient-to-r from-pink-900 via-purple-900 to-indigo-800 inline-block text-transparent bg-clip-text'>
          About Us & Contact
        </h1>

        <Card className='mb-8 bg-white shadow-md'>
          <CardHeader>
            <CardTitle className='text-2xl font-semibold text-purple-800'>
              Our Story
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-slate-700 mb-4'>
              Sweet Moments Bakery has been crafting delightful treats since
              2005. Our passion for baking and dedication to quality ingredients
              have made us a beloved part of the community. From custom cakes to
              daily fresh pastries, we put love into every creation.
            </p>
            <p className='text-slate-700'>
              Our team of skilled bakers and decorators work tirelessly to
              ensure that every bite brings joy to our customers. We believe in
              the power of sweet moments to brighten days and create lasting
              memories.
            </p>
          </CardContent>
        </Card>

        <h2 className='text-2xl font-semibold mb-4 text-purple-800'>
          Our Locations
        </h2>
        <div className='grid md:grid-cols-2 gap-6 mb-8'>
          {stores.map((store, index) => (
            <Card key={index} className='bg-white shadow-md'>
              <CardHeader>
                <CardTitle className='text-xl font-semibold text-purple-800'>
                  {store.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className='text-slate-700 mb-2'>{store.address}</p>
                <p className='text-slate-700 mb-2'>Phone: {store.phone}</p>
                <p className='text-slate-700'>Email: {store.email}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className='bg-white shadow-md'>
          <CardHeader>
            <CardTitle className='text-2xl font-semibold text-purple-800'>
              Find Us
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='aspect-w-16 aspect-h-9 rounded-lg overflow-hidden'>
              <Image
                src='/placeholder.svg'
                alt='Map of our store locations'
                width={800}
                height={450}
                className='object-cover'
              />
            </div>
            <p className='text-sm text-slate-500 mt-2'>
              Map placeholder: In a real application, embed a Google Maps
              component here showing both store locations.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
