"use client";

import React from 'react';

// Simple auth client without Better Auth
export const authClient = {
  signUp: {
    email: async ({ email, password, name }: any) => {
      const response = await fetch('/api/auth/sign-up/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: data };
      }
      return { data };
    },
  },
  signIn: {
    email: async ({ email, password }: any) => {
      const response = await fetch('/api/auth/sign-in/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { error: data };
      }
      return { data };
    },
  },
  signOut: async () => {
    const response = await fetch('/api/auth/sign-out', {
      method: 'POST',
    });
    const data = await response.json();
    if (!response.ok) {
      return { error: data };
    }
    return { data };
  },
  getSession: async () => {
    const response = await fetch('/api/auth/session');
    const data = await response.json();
    return data;
  },
};

export const {
  signIn,
  signUp,
  signOut,
  getSession,
} = authClient;

// Simple session hook for client components
export function useSession() {
  const [data, setData] = React.useState(null);
  const [isPending, setIsPending] = React.useState(false);

  const fetchSession = async () => {
    setIsPending(true);
    try {
      const session = await getSession();
      setData(session);
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setData({ user: null, authenticated: false });
    } finally {
      setIsPending(false);
    }
  };

  React.useEffect(() => {
    fetchSession();

    const interval = setInterval(fetchSession, 5 * 60 * 1000); // Check every 5 minutes

    return () => {
      clearInterval(interval);
    };
  }, []);

  return { data, isPending, refetch: fetchSession };
}