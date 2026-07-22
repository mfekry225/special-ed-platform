// Supabase Edge Function: notify-parent
// ترسل رسالة واتساب لولي الأمر عبر WhatsApp Business Cloud API عند مشاركة جلسة أو تحديث تقدّم.
// انشرها بالأمر: supabase functions deploy notify-parent

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_ACCESS_TOKEN")!;
const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;

Deno.serve(async (req) => {
  try {
    const { child_id, channel } = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: child, error } = await supabase
      .from("children")
      .select("full_name, guardian_phone")
      .eq("id", child_id)
      .single();

    if (error || !child) {
      return new Response(JSON.stringify({ error: "لم يتم العثور على الطفل" }), { status: 404 });
    }

    const message = `تحديث جديد بخصوص ${child.full_name}: تمت مشاركة ملخص الجلسة اليوم على المنصة. افتح بوابة ولي الأمر لمراجعة التفاصيل.`;

    if (channel === "whatsapp") {
      await fetch(`https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_ID}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: child.guardian_phone,
          type: "text",
          text: { body: message },
        }),
      });
    }

    await supabase.from("parent_notifications").insert({
      child_id,
      channel,
      message,
    });

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
});
