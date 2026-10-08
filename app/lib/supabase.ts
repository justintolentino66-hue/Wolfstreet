import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Gracefully handle missing env vars in development/preview
// The client is still exported but Supabase calls will fail gracefully
// without crashing the build or dev server startup.
let supabase: SupabaseClient;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  if (typeof window !== "undefined") {
    console.warn(
      "[EMS] Supabase env vars are not set. " +
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "to your .env.local file. Using offline/fallback mode."
    );
  }
  // Stub client so imports don't break — real calls will return errors
  supabase = createClient(
    "https://placeholder.supabase.co",
    "placeholder-anon-key"
  );
}

export { supabase };
