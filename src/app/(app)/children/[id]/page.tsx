"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { LanguageAssessmentTool } from "@/components/dashboard/LanguageAssessmentTool";
import { ProgressRing } from "@/components/session/ProgressRing";
import { Button } from "@/components/ui/button";
import { ClipboardEdit, ClipboardList } from "lucide-react";

const tabs = ["نظرة_عامة", "تقييم_اللغة", "سجل_الجلسات"] as const;
type Tab = (typeof tabs)[number];

const tabLabels: Record<Tab, string> = {
  نظرة_عامة: "نظرة عامة",
  تقييم_اللغة: "تقييم اللغة",
  سجل_الجلسات: "سجل الجلسات",
};

export default function ChildProfilePage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<Tab>("نظرة_عامة");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rifq-100 font-display text-2xl font-bold text-rifq-600 dark:bg-rifq-900 dark:text-rifq-200">
          ي
        </div>
        <div>
          <h1 className="font-display text-xl font-extrabold text-ink-900 dark:text-ink-50">يوسف أحمد</h1>
          <p className="text-sm text-ink-400">5 سنوات · طيف التوحد · ولي الأمر: أحمد يوسف</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Link href={`/session/${params.id}`} className="flex-1">
          <Button size="lg" className="w-full">
            <ClipboardList size={18} /> بدء جلسة اليوم
          </Button>
        </Link>
        <Link href={`/iep/${params.id}`} className="flex-1">
          <Button variant="secondary" size="lg" className="w-full">
            <ClipboardEdit size={18} /> تعديل الخطة التربوية
          </Button>
        </Link>
      </div>

      {/* تبويبات */}
      <div className="flex gap-1 overflow-x-auto rounded-xl2 bg-ink-100 p-1 dark:bg-dark-border">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "touch-target flex-1 whitespace-nowrap rounded-xl2 px-3 py-2 text-sm font-bold transition-colors",
              tab === t ? "bg-white text-rifq-600 shadow-card dark:bg-dark-surface" : "text-ink-400"
            )}
          >
            {tabLabels[t]}
          </button>
        ))}
      </div>

      {tab === "نظرة_عامة" && (
        <div className="grid grid-cols-3 gap-3">
          <ProgressRing percent={62} label="التقدم العام" tone="rifq" />
          <ProgressRing percent={80} label="الحضور" tone="sage" />
          <ProgressRing percent={45} label="الأهداف المكتسبة" tone="amber" />
        </div>
      )}

      {tab === "تقييم_اللغة" && <LanguageAssessmentTool />}

      {tab === "سجل_الجلسات" && (
        <p className="text-center text-sm text-ink-400 py-8">ستظهر هنا قائمة الجلسات السابقة مرتبة زمنياً.</p>
      )}
    </div>
  );
}
