"use client";

import { useState } from "react";
import { GoalTracker, Rating } from "@/components/session/GoalTracker";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Save, Send, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

// في التطبيق الفعلي: تُجلب هذه الأهداف من جدول iep_goals عبر
// supabase.from("iep_goals").select("*").eq("child_id", childId).eq("status", "قيد_التقدم")
const activeGoals = [
  {
    id: "g1",
    domain: "لغوي",
    title: "نطق أسماء 10 أشياء شائعة بشكل مستقل",
    kpi: "ينطق 8 من 10 كلمات مستهدفة دون مساعدة، في جلستين متتاليتين",
    baselineProgress: 55,
  },
  {
    id: "g2",
    domain: "تواصل_اجتماعي",
    title: "المبادرة بطلب شيء بالإشارة أو الكلمة",
    kpi: "يبادر 3 مرات خلال الجلسة دون تلقين",
    baselineProgress: 40,
  },
  {
    id: "g3",
    domain: "سلوكي",
    title: "البقاء جالساً أثناء النشاط الموجّه",
    kpi: "يبقى جالساً 8 دقائق متواصلة من أصل 10",
    baselineProgress: 70,
  },
];

export default function SessionPage({ params }: { params: { childId: string } }) {
  const [attended, setAttended] = useState(true);
  const [results, setResults] = useState<Record<string, { rating: Rating; note: string }>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleGoalChange(goalId: string, rating: Rating, note: string) {
    setResults((prev) => ({ ...prev, [goalId]: { rating, note } }));
  }

  async function handleSave(shareWithParent: boolean) {
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.from("sessions").insert({
        child_id: params.childId,
        attended,
        goal_results: Object.entries(results).map(([goal_id, r]) => ({
          goal_id,
          rating: r.rating,
          note: r.note,
        })),
        shared_with_parent: shareWithParent,
        session_date: new Date().toISOString(),
      });
      // إرسال إشعار واتساب لولي الأمر عند المشاركة — يتم عبر Edge Function
      // تستدعي WhatsApp Business API webhook
      if (shareWithParent) {
        await supabase.functions.invoke("notify-parent", {
          body: { child_id: params.childId, channel: "whatsapp" },
        });
      }
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 pb-6">
      {/* رأس الجلسة */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-xl font-extrabold text-ink-900 dark:text-ink-50">
              جلسة اليوم — يوسف أحمد
            </h1>
            <p className="flex items-center gap-1.5 text-xs text-ink-400">
              <Clock size={13} /> الأربعاء، ٢٢ يوليو ٢٠٢٦ · مدة الجلسة: 30 دقيقة
            </p>
          </div>
          <button
            onClick={() => setAttended((a) => !a)}
            className={`touch-target flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold ${
              attended ? "bg-sage-100 text-sage-600" : "bg-coral-100 text-coral-600"
            }`}
          >
            <Check size={14} /> {attended ? "حاضر" : "غائب"}
          </button>
        </div>
      </Card>

      {/* أهداف الخطة التربوية النشطة لهذه الجلسة */}
      <div>
        <h2 className="mb-3 font-display text-lg font-bold text-ink-900 dark:text-ink-50">
          أهداف الخطة التربوية الفردية (IEP)
        </h2>
        <div className="space-y-3">
          {activeGoals.map((goal) => (
            <GoalTracker key={goal.id} goalId={goal.id} {...goal} onChange={handleGoalChange} />
          ))}
        </div>
      </div>

      {/* شريط إجراءات ثابت في أسفل الشاشة على الهاتف لسهولة الحفظ بيد واحدة */}
      <div className="fixed inset-x-0 bottom-16 z-30 border-t border-ink-100 bg-white/95 p-3 backdrop-blur dark:border-dark-border dark:bg-dark-surface/95 md:static md:rounded-xl2 md:border md:p-4">
        {saved ? (
          <p className="text-center text-sm font-bold text-sage-600">تم حفظ الجلسة ومشاركتها بنجاح ✓</p>
        ) : (
          <div className="mx-auto flex max-w-5xl gap-2">
            <Button variant="secondary" size="lg" className="flex-1" onClick={() => handleSave(false)} disabled={saving}>
              <Save size={18} /> حفظ فقط
            </Button>
            <Button variant="primary" size="lg" className="flex-1" onClick={() => handleSave(true)} disabled={saving}>
              <Send size={18} /> حفظ ومشاركة مع ولي الأمر
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
