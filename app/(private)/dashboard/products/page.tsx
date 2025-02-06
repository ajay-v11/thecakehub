'use client';
import React, {useEffect, useState} from 'react';
import {Plus, Trash2} from 'lucide-react';
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
} from '@/components/ui/alert-dialog';
import {getAllProducts} from '@/lib/actions/products';

const AdminProductCard = ({product, onDelete}) => {
  return (
    <div className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'>
      <div className='relative h-48 overflow-hidden'>
        <img
          src={product.imageUrl}
          alt={product.title}
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
          <span className='text-sm text-gray-500'>
            Quantity: {product.quantity}
          </span>
          <span className='text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full'>
            ID: {product.id}
          </span>
        </div>
      </div>
    </div>
  );
};

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    title: '',
    quantity: 0,
    category: '',
    imageUrl: '',
    price: 0,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const results = await getAllProducts();
      setProducts(results.products);
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setNewProduct((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleAddProduct = () => {
    const newId = Math.max(...products.map((p) => p.id)) + 1;
    const productToAdd = {
      ...newProduct,
      id: newId,
    };

    setProducts((prev) => [...prev, productToAdd]);
    setNewProduct({
      title: '',
      quantity: 0,
      category: '',
      imageUrl: '',
      price: 0,
    });
    setIsDialogOpen(false);
  };

  const handleDeleteProduct = (productId) => {
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
                  <Label htmlFor='quantity' className='text-right'>
                    Quantity
                  </Label>
                  <Input
                    id='quantity'
                    name='quantity'
                    type='number'
                    value={newProduct.quantity}
                    onChange={handleInputChange}
                    className='col-span-3'
                    min='0'
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
