import 'next-auth';
import {ConfirmationResult} from 'firebase/auth';

declare module 'next-auth' {
  interface User {
    id: number;
    name: string;

    email: string | null;
    isAdmin: boolean;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: number;
    name: string;

    email: string | null;
    isAdmin: boolean;
  }
}

declare global {
  interface Window {
    confirmationResult: ConfirmationResult;
  }
}

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type floatinCartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};
