'use client';

import {signIn, signOut, useSession} from 'next-auth/react';

export function LoginButton() {
  return <button onClick={() => signIn()}>Sign in</button>;
}

export function LogoutButton() {
  return <button onClick={() => signOut()}>Sign out</button>;
}
export function SessionInfo() {
  const {data: session} = useSession();

  if (session) {
    return (
      <div>
        Signed in as {session.user?.name}
        <LogoutButton />
      </div>
    );
  }
  return (
    <div className='h-96 w-96 bg-slate-600'>
      Not signed in <br />
      <LoginButton />
    </div>
  );
}
