'use client';
import {zodResolver} from '@hookform/resolvers/zod';
import React from 'react';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {Button} from '../ui/button';
import {Input} from '../ui/input';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  phone: z.string().min(10, {message: 'Invalid phone number'}),
  address: z.string().min(1, {message: 'enter a valid address'}),
});

function AddressForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      phone: '',
      address: '',
    },
  });
  console.log('formContext:', form);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8 max-w-4xl items-center justify-center'>
        <FormField
          control={form.control}
          name='username'
          render={({field}) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='phone'
          render={({field}) => (
            <FormItem>
              <FormLabel>Phone no:-</FormLabel>
              <FormControl>
                <Input placeholder='shadcn' {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='address'
          render={({field}) => (
            <FormItem className='flex flex-col '>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <textarea
                  placeholder='shadcn'
                  {...field}
                  className='border border-gray-200 rounded-lg p-3 focus:border-slate-800 '
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Submit</Button>
      </form>
    </Form>
  );
}

export default AddressForm;
