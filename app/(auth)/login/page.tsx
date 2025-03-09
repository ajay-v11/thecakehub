import Login from '@/components/auth/login';
import {Suspense} from 'react';

function LoginWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Login />
    </Suspense>
  );
}

export default LoginWrapper;
