import { createBrowserClient } from "@supabase/ssr";

// يُستخدم هذا العميل داخل مكونات "use client" (تفاعلات المستخدم المباشرة)
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
