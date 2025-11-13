import { createClient } from '@supabase/supabase-js';

// Support both Vite and React App environment variable conventions
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client for development without Supabase
const createMockSupabase = () => ({
  auth: {
    signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    signOut: async () => ({ error: { message: 'Supabase not configured' } }),
    resetPasswordForEmail: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    updateUser: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    getUser: async () => ({ data: { user: null }, error: { message: 'Supabase not configured' } }),
    getSession: async () => ({ data: { session: null }, error: { message: 'Supabase not configured' } }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: async () => ({ data: [], error: { message: 'Supabase not configured' } }),
    insert: async () => ({ data: [], error: { message: 'Supabase not configured' } }),
    update: async () => ({ data: [], error: { message: 'Supabase not configured' } }),
    delete: async () => ({ error: { message: 'Supabase not configured' } }),
  }),
  channel: () => ({
    on: () => ({
      subscribe: () => ({ unsubscribe: () => {} }),
    }),
  }),
});

let supabase: any;
let auth: any;
let db: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Required variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  
  const mockSupabase = createMockSupabase();
  supabase = mockSupabase;
  auth = mockSupabase.auth;
  db = mockSupabase;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  // Auth helper functions
  auth = {
    signUp: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { data, error };
    },

    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    },

    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      return { error };
    },

    resetPassword: async (email: string) => {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      return { data, error };
    },

    updatePassword: async (password: string) => {
      const { data, error } = await supabase.auth.updateUser({
        password,
      });
      return { data, error };
    },

    getCurrentUser: async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      return { user, error };
    },

    onAuthStateChange: (callback: (event: string, session: any) => void) => {
      return supabase.auth.onAuthStateChange(callback);
    },
  };

  // Database helper functions
  db = {
    // Generic CRUD operations
    select: async <T>(table: string, query?: string) => {
      const { data, error } = await supabase
        .from(table)
        .select(query || '*');
      return { data: data as T[], error };
    },

    insert: async <T>(table: string, data: Partial<T>) => {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select();
      return { data: result as T[], error };
    },

    update: async <T>(table: string, data: Partial<T>, match: Record<string, unknown>) => {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .match(match)
        .select();
      return { data: result as T[], error };
    },

    delete: async (table: string, match: Record<string, unknown>) => {
      const { error } = await supabase
        .from(table)
        .delete()
        .match(match);
      return { error };
    },

    // Real-time subscriptions
    subscribe: (table: string, callback: (payload: any) => void) => {
      return supabase
        .channel(table)
        .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
        .subscribe();
    },
  };
}

export { supabase, auth, db };
export default supabase; 