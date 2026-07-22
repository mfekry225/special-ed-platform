"use client";

import { useState } from "react";
import { ChildCard } from "@/components/dashboard/ChildCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const children = [
  { id: "1", name: "يوسف أحمد", age: "5 سنوات", diagnosis: "طيف_التوحد", lastSession: "أمس", overallProgress: 62 },
  { id: "2", name: "لينا خالد", age: "4 سنوات و٦ أشهر", diagnosis: "تأخر_لغوي", lastSession: "قبل يومين", overallProgress: 78 },
  { id: "3", name: "عمر سالم", age: "6 سنوات", diagnosis: "صعوبات_تواصل", lastSession: "اليوم", overallProgress: 45 },
];

export default function ChildrenPage() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ full_name: "", birth_date: "", diagnosis: "تأخر_لغوي", guardian_name: "", guardian_phone: "" });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const supabase = createClient();
      await supabase.from("children").insert(form);
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-xl font-extrabold text-ink-900 dark:text-ink-50">ملفات الأطفال</h1>
        <Button onClick={() => setOpen(true)}>
          <Plus size={18} /> إضافة طفل
        </Button>
      </div>

      <div className="space-y-3">
        {children.map((c) => (
          <ChildCard key={c.id} {...c} />
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/40 md:items-center">
          <Card className="w-full max-w-md space-y-3 rounded-b-none md:rounded-xl2">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold">إضافة طفل جديد</h2>
              <button onClick={() => setOpen(false)} className="touch-target text-ink-400">
                <X size={20} />
              </button>
            </div>

            <input
              placeholder="اسم الطفل"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              className="w-full rounded-xl2 border border-ink-100 bg-ink-50 p-3 text-sm outline-none focus:border-rifq-400"
            />
            <input
              type="date"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
              className="w-full rounded-xl2 border border-ink-100 bg-ink-50 p-3 text-sm outline-none focus:border-rifq-400"
            />
            <select
              value={form.diagnosis}
              onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
              className="w-full rounded-xl2 border border-ink-100 bg-ink-50 p-3 text-sm outline-none focus:border-rifq-400"
            >
              <option value="تأخر_لغوي">تأخر لغوي</option>
              <option value="طيف_التوحد">طيف التوحد</option>
              <option value="صعوبات_تواصل">صعوبات تواصل</option>
              <option value="متلازمة_داون">متلازمة داون</option>
              <option value="إعاقة_سمعية">إعاقة سمعية</option>
              <option value="أخرى">أخرى</option>
            </select>
            <input
              placeholder="اسم ولي الأمر"
              value={form.guardian_name}
              onChange={(e) => setForm({ ...form, guardian_name: e.target.value })}
              className="w-full rounded-xl2 border border-ink-100 bg-ink-50 p-3 text-sm outline-none focus:border-rifq-400"
            />
            <input
              placeholder="رقم واتساب ولي الأمر (لإرسال التحديثات)"
              value={form.guardian_phone}
              onChange={(e) => setForm({ ...form, guardian_phone: e.target.value })}
              dir="ltr"
              className="w-full rounded-xl2 border border-ink-100 bg-ink-50 p-3 text-sm outline-none focus:border-rifq-400"
            />

            <Button size="lg" className="w-full" onClick={handleSubmit} disabled={submitting}>
              حفظ الملف
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
