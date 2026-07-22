"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/session/ProgressRing";

interface Dimension {
  key: "receptive" | "expressive" | "social";
  label: string;
  helper: string;
  score: number;
}

function levelFromAverage(avg: number) {
  if (avg < 30) return "مبتدئ";
  if (avg < 60) return "نامٍ";
  if (avg < 85) return "متقدم";
  return "قريب من العمر الزمني";
}

/**
 * أداة تقييم مبدئي لمستوى اللغة والتواصل: يقيّم المعلم الطفل عبر
 * ثلاثة محاور أساسية بشرائح لمسية بسيطة (0-100)، وتُحسب النتيجة
 * الإجمالية والمستوى تلقائياً — بديل سريع عن استمارات الورق التقليدية.
 */
export function LanguageAssessmentTool() {
  const [dims, setDims] = useState<Dimension[]>([
    { key: "receptive", label: "اللغة الاستقبالية (الفهم)", helper: "فهم التعليمات والكلمات والإشارات", score: 50 },
    { key: "expressive", label: "اللغة التعبيرية (النطق)", helper: "عدد المفردات، تركيب الجمل، وضوح النطق", score: 50 },
    { key: "social", label: "التواصل الاجتماعي", helper: "التواصل البصري، المبادرة، تبادل الأدوار", score: 50 },
  ]);
  const [notes, setNotes] = useState("");

  const average = Math.round(dims.reduce((sum, d) => sum + d.score, 0) / dims.length);

  function updateScore(key: Dimension["key"], value: number) {
    setDims((prev) => prev.map((d) => (d.key === key ? { ...d, score: value } : d)));
  }

  return (
    <Card className="space-y-5">
      <CardHeader>
        <CardTitle>تقييم مستوى اللغة والتواصل</CardTitle>
        <ProgressRing percent={average} size={60} strokeWidth={6} label={levelFromAverage(average)} />
      </CardHeader>

      <div className="space-y-5">
        {dims.map((d) => (
          <div key={d.key}>
            <div className="mb-1 flex items-center justify-between">
              <label className="text-sm font-bold text-ink-900 dark:text-ink-50">{d.label}</label>
              <span className="font-data text-sm font-bold text-rifq-500">{d.score}</span>
            </div>
            <p className="mb-2 text-xs text-ink-400">{d.helper}</p>
            <input
              type="range"
              min={0}
              max={100}
              value={d.score}
              onChange={(e) => updateScore(d.key, Number(e.target.value))}
              className="h-3 w-full touch-target cursor-pointer appearance-none rounded-full bg-ink-100 accent-rifq-500 dark:bg-dark-border"
            />
          </div>
        ))}
      </div>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="ملاحظات حول النطق، مخارج الحروف، أو سلوكيات لوحظت أثناء التقييم..."
        rows={3}
        className="w-full rounded-xl2 border border-ink-100 bg-ink-50 p-3 text-sm outline-none focus:border-rifq-400 dark:border-dark-border dark:bg-dark-bg"
      />

      <Button size="lg" className="w-full">
        حفظ التقييم وإنشاء خطة تربوية مقترحة
      </Button>
    </Card>
  );
}
