import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  // Return a stub client when credentials are missing (frontend-only dev)
  if (!url || !key) {
    const noop = () => ({ data: null, error: null })
    const noopAsync = async () => ({ data: null, error: null })
    const authStub = {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      signInWithPassword: noopAsync,
      signUp: noopAsync,
      signOut: noopAsync,
      resetPasswordForEmail: noopAsync,
      updateUser: noopAsync,
      setSession: noopAsync,
    }
    return { auth: authStub, from: () => ({ select: noop, insert: noop, update: noop, delete: noop }), storage: { from: () => ({ list: noopAsync, createSignedUrl: noopAsync }) } }
  }

  // Create a supabase client on the browser with project's credentials
  return createBrowserClient(url, key)
}