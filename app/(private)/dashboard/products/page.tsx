'use client';
import React, {useEffect, useState} from 'react';
import {Plus} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {addProduct, getAllProducts} from '@/lib/actions/products';
import {AdminProductCard} from '@/components/admin/adminproductcard';
import {NewProduct, Product} from '@/lib/types';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    title: '',
    category: '',
    imageUrl: '',
    description: '',
    price: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const results = await getAllProducts();
      if (results && results.success) {
        setProducts(results.products);
      } else {
        setProducts([]); // Fallback to an empty array if results is undefined
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value, // ✅ Convert price to number
    }));
  };

  const handleCategoryChange = (value: string) => {
    setNewProduct((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleAddProduct = async () => {
    try {
      const result = await addProduct(newProduct); // ✅ Call the server action

      if (result?.success && result.product) {
        setProducts((prev) => [
          ...prev,
          {
            ...result.product,
            description: result.product.description ?? '', // ✅ Convert null to an empty string
          },
        ]); // ✅ Update state with new product
        setNewProduct({
          title: '',
          description: '',
          category: '',
          imageUrl: '',
          price: 0,
        });
        setIsDialogOpen(false);
      } else {
        console.error(
          'Failed to add product:',
          result?.error || 'unknow error'
        );
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = (productId: number) => {
    setProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='space-y-12 px-5 md:px-10 lg:px-20 pt-7 md:pt-12 lg:pt-16'>
        <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
          <h1 className='text-2xl md:text-3xl lg:text-4xl font-bold text-purple-800'>
            Admin Products
          </h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className='bg-purple-800 hover:bg-purple-700 h-12 px-6 text-lg'>
                <Plus className='mr-2 h-5 w-5' /> Add New Product
              </Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[500px]'>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the product details below. All fields are required.
                </DialogDescription>
              </DialogHeader>
              <div className='grid gap-6 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='title' className='text-right'>
                    Title
                  </Label>
                  <Input
                    id='title'
                    name='title'
                    value={newProduct.title}
                    onChange={handleInputChange}
                    className='col-span-3'
                    placeholder='Enter product title'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='imageUrl' className='text-right'>
                    Image URL
                  </Label>
                  <Input
                    id='imageUrl'
                    name='imageUrl'
                    value={newProduct.imageUrl}
                    onChange={handleInputChange}
                    className='col-span-3'
                    placeholder='Enter image URL'
                  />
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='category' className='text-right'>
                    Category
                  </Label>
                  <Select
                    onValueChange={handleCategoryChange}
                    value={newProduct.category}>
                    <SelectTrigger className='col-span-3'>
                      <SelectValue placeholder='Select category' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Cakes'>Cakes</SelectItem>
                      <SelectItem value='Puffs'>Puffs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='price' className='text-right'>
                    Price (₹)
                  </Label>
                  <Input
                    id='price'
                    name='price'
                    type='number'
                    value={newProduct.price}
                    onChange={handleInputChange}
                    className='col-span-3'
                    min='0'
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleAddProduct}
                  className='bg-purple-800 hover:bg-purple-700'>
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {products.map((product) => (
              <AdminProductCard
                key={product.id}
                product={product}
                onDelete={handleDeleteProduct}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
