'use client';
import React from 'react';
import {useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {z} from 'zod';
import {signIn} from 'next-auth/react';
import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {Input} from '@/components/ui/input';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(1, {message: 'Name is required'}),
});

function Login() {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form values:', values);
    setLoginError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        username: values.username,
      });
      console.log('signiin creds', result);

      if (result?.error) {
        // Map common error messages
        const errorMap: {[key: string]: string} = {
          CredentialsSignin: 'Invalid credentials. Please try again.',
          'Missing credentials': 'Please provide both email and name.',
          'Failed to create/find user':
            'Authentication failed. Please try again.',
        };

        setLoginError(
          errorMap[result.error] ||
            'An unexpected error occurred during login. Please try again.'
        );
      } else {
        // Successful login - you might want to replace this with a proper redirect
        window.location.href = '/dashboard';
      }
    } catch (error) {
      // Handle network errors or other unexpected issues
      setLoginError(
        'A network error occurred. Please check your connection and try again.'
      );
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }
  function onGoogleClick() {
    setLoginError(null);
    setIsLoading(true);

    try {
      signIn('google', {callbackUrl: '/dashboard'});
    } catch (error) {
      console.error('Google Sign-in Error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='flex items-center justify-center mt-32 mb-44'>
      <div className='flex flex-col w-full max-w-md px-4'>
        <h1 className='text-xl text-gray-800 p-4 text-center'>Login</h1>

        {loginError && (
          <Alert variant='destructive' className='mb-4'>
            <AlertTitle>Login Error</AlertTitle>
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='email'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='you@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='username'
              render={({field}) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Dave' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
        <Button
          onClick={onGoogleClick}
          variant='outline'
          className='w-full mt-10'>
          <img src='/google.png' alt='google log' className='h-5 w-5'></img>{' '}
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
