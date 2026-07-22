import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// يُستخدم هذا العميل داخل Server Components و Route Handlers فقط
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch {
            // يمكن تجاهل الخطأ بأمان إن استُدعيت من Server Component
            // لا يملك صلاحية تعديل الكوكيز مباشرة (يتم التعديل عبر middleware)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch {
            // نفس الملاحظة أعلاه
          }
        },
      },
    }
  );
}
