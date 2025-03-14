import AuthPage from '@/components/auth/login';
import {Suspense} from 'react';

function LoginWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthPage />
    </Suspense>
  );
}

export default LoginWrapper;
