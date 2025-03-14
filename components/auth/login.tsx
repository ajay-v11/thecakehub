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
import {useRouter, useSearchParams} from 'next/navigation';

// Login form schema (email and password)
const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, {message: 'Password must be at least 6 characters'}),
});

// Signup form schema (email, username, password, and confirmation)
const signupFormSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    username: z.string().min(1, {message: 'Name is required'}),
    password: z
      .string()
      .min(6, {message: 'Password must be at least 6 characters'}),
    confirmPassword: z
      .string()
      .min(6, {message: 'Please confirm your password'}),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';

  // Login form
  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Signup form
  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form switch
  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setAuthError(null);
    loginForm.reset();
    signupForm.reset();
  };

  // Handle login submission
  async function onLoginSubmit(values: z.infer<typeof loginFormSchema>) {
    setAuthError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        const errorMap: {[key: string]: string} = {
          CredentialsSignin: 'Invalid credentials. Please try again.',
          'Missing credentials': 'Please provide both email and password.',
          'Failed to create/find user':
            'Authentication failed. Please try again.',
        };

        setAuthError(
          errorMap[result.error] ||
            'An unexpected error occurred during login. Please try again.'
        );
      } else {
        router.push(redirectUrl);
      }
    } catch (error) {
      setAuthError(
        'A network error occurred. Please check your connection and try again.'
      );
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Handle signup submission
  async function onSignupSubmit(values: z.infer<typeof signupFormSchema>) {
    setAuthError(null);
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
        username: values.username,
      });

      if (result?.error) {
        const errorMap: {[key: string]: string} = {
          CredentialsSignin: 'Invalid credentials. Please try again.',
          'Missing credentials': 'Please provide all required fields.',
          'User already exists': 'An account with this email already exists.',
        };

        setAuthError(
          errorMap[result.error] ||
            'An unexpected error occurred during signup. Please try again.'
        );
      } else {
        router.push(redirectUrl);
      }
    } catch (error) {
      setAuthError(
        'A network error occurred. Please check your connection and try again.'
      );
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function onGoogleClick() {
    setAuthError(null);
    setIsLoading(true);

    signIn('google', {callbackUrl: redirectUrl})
      .then((result) => {
        if (result?.error) {
          setAuthError('Google sign-in failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Google Sign-in Error:', error);
        setAuthError('A network error occurred. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <div className='flex items-center justify-center mt-32 mb-44'>
      <div className='flex flex-col w-full max-w-md px-4'>
        <h1 className='text-xl text-gray-800 p-4 text-center'>
          {isSignUp ? 'Create an Account' : 'Login'}
        </h1>

        {authError && (
          <Alert variant='destructive' className='mb-4'>
            <AlertTitle>{isSignUp ? 'Signup Error' : 'Login Error'}</AlertTitle>
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {isSignUp ? (
          <SignupForm
            form={signupForm}
            onSubmit={onSignupSubmit}
            isLoading={isLoading}
          />
        ) : (
          <LoginForm
            form={loginForm}
            onSubmit={onLoginSubmit}
            isLoading={isLoading}
          />
        )}

        <div className='text-center mt-4 text-sm'>
          <button
            onClick={toggleForm}
            className='text-blue-600 hover:text-blue-800 underline transition-colors'
            type='button'>
            {isSignUp
              ? 'Already have an account? Log in'
              : "Don't have an account? Sign up"}
          </button>
        </div>

        <div className='relative my-8'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white text-gray-500'>
              Or continue with
            </span>
          </div>
        </div>

        <Button
          onClick={onGoogleClick}
          variant='outline'
          className='w-full'
          type='button'
          disabled={isLoading}>
          <img src='/google.png' alt='google logo' className='h-5 w-5 mr-2' />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </Button>
      </div>
    </div>
  );
}

// Login Form Component
function LoginForm({
  form,
  onSubmit,
  isLoading,
}: {
  form: any;
  onSubmit: (values: z.infer<typeof loginFormSchema>) => void;
  isLoading: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='you@example.com' type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='******' type='password' {...field} />
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
  );
}

// Signup Form Component
function SignupForm({
  form,
  onSubmit,
  isLoading,
}: {
  form: any;
  onSubmit: (values: z.infer<typeof signupFormSchema>) => void;
  isLoading: boolean;
}) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='you@example.com' type='email' {...field} />
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
        <FormField
          control={form.control}
          name='password'
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder='******' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({field}) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder='******' type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
}

export default AuthPage;
