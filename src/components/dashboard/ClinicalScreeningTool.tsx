"use client";

import { useState } from "react";
import { ASSESSMENT_SCALES, ScaleId, interpretScore } from "@/lib/assessmentScales";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  ShieldAlert,
  BrainCircuit,
  Activity,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const icons = { MessageSquare, ShieldAlert, BrainCircuit, Activity };

const toneClasses = {
  rifq: "bg-rifq-50 text-rifq-600 border-rifq-200 dark:bg-rifq-900 dark:text-rifq-200",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
  sage: "bg-sage-100 text-sage-600 border-sage-100",
  coral: "bg-coral-100 text-coral-600 border-coral-100",
};

const answerOptions = [
  { value: 0, label: "لا" },
  { value: 1, label: "أحياناً" },
  { value: 2, label: "غالباً" },
];

type Stage = "select" | "running" | "result";

export function ClinicalScreeningTool({ childId }: { childId: string }) {
  const [stage, setStage] = useState<Stage>("select");
  const [activeScaleId, setActiveScaleId] = useState<ScaleId | null>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const scale = activeScaleId ? ASSESSMENT_SCALES[activeScaleId] : null;

  function startScale(id: ScaleId) {
    setActiveScaleId(id);
    setAnswers({});
    setStep(0);
    setSaved(false);
    setStage("running");
  }

  function answer(value: number) {
    if (!scale) return;
    const q = scale.questions[step];
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    if (step < scale.questions.length - 1) {
      setStep(step + 1);
    } else {
      setStage("result");
    }
  }

  const totalScore = Object.values(answers).reduce((a, b) => a + b, 0);
  const level = scale ? interpretScore(scale, totalScore) : "low";
  const interpretation = scale?.interpretations[level];

  async function saveResult() {
    if (!scale) return;
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.from("clinical_screenings").insert({
        child_id: childId,
        scale_id: scale.id,
        answers: Object.entries(answers).map(([question_id, score]) => ({
          question_id: Number(question_id),
          score,
        })),
        total_score: totalScore,
        interpretation_level: level,
      });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  // ---------- شاشة اختيار المقياس ----------
  if (stage === "select") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {Object.values(ASSESSMENT_SCALES).map((s) => {
          const Icon = icons[s.iconName as keyof typeof icons];
          return (
            <button key={s.id} onClick={() => startScale(s.id)} className="text-right">
              <Card className="h-full transition-shadow hover:shadow-soft active:scale-[0.99]">
                <div className={cn("mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl2 border", toneClasses[s.tone])}>
                  <Icon size={20} />
                </div>
                <h3 className="font-display font-bold text-ink-900 dark:text-ink-50">{s.title}</h3>
                <p className="mt-1 text-xs text-ink-400">{s.subtitle}</p>
                <div className="mt-3 flex items-center justify-between text-[11px] text-ink-400">
                  <span>{s.targetAge}</span>
                  <span>{s.questions.length} بنود</span>
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    );
  }

  if (!scale) return null;

  // ---------- شاشة الإجابة خطوة بخطوة ----------
  if (stage === "running") {
    const q = scale.questions[step];
    const progress = ((step + 1) / scale.questions.length) * 100;

    return (
      <Card className="space-y-5">
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-ink-400">
            <span>
              سؤال {step + 1} من {scale.questions.length}
            </span>
            <button onClick={() => setStage("select")} className="text-rifq-500">
              تغيير المقياس
            </button>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-dark-border">
            <div className="h-full rounded-full bg-rifq-500 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg font-bold leading-relaxed text-ink-900 dark:text-ink-50">
            {q.text}
          </h3>
          {q.subHint && <p className="mt-2 text-xs text-ink-400">{q.subHint}</p>}
        </div>

        <div className="grid grid-cols-3 gap-2">
          {answerOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => answer(opt.value)}
              className="touch-target rounded-xl2 border-2 border-ink-100 bg-ink-50 py-4 text-sm font-bold text-ink-700 transition-all hover:border-rifq-400 active:scale-95 dark:border-dark-border dark:bg-dark-bg dark:text-ink-50"
            >
              {opt.label}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="flex touch-target items-center gap-1 text-xs font-bold text-ink-400"
          >
            <ChevronRight size={16} /> السؤال السابق
          </button>
        )}
      </Card>
    );
  }

  // ---------- شاشة النتيجة والتوصيات ----------
  const levelTone: "success" | "warning" | "danger" =
    level === "low" ? "success" : level === "moderate" ? "warning" : "danger";

  return (
    <Card className="space-y-4">
      <div className="text-center">
        <Badge tone={levelTone}>{interpretation?.label}</Badge>
        <p className="mt-3 font-data text-3xl font-extrabold text-ink-900 dark:text-ink-50">
          {totalScore} <span className="text-base font-bold text-ink-400">/ 20</span>
        </p>
        <h3 className="mt-2 font-display font-bold text-ink-900 dark:text-ink-50">{scale.title}</h3>
      </div>

      <p className="rounded-xl2 bg-ink-50 p-3 text-sm leading-relaxed text-ink-700 dark:bg-dark-bg dark:text-ink-50">
        {interpretation?.summary}
      </p>

      <div>
        <h4 className="mb-2 text-sm font-bold text-ink-900 dark:text-ink-50">التوصيات المقترحة</h4>
        <ul className="space-y-2">
          {interpretation?.advice.map((a, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink-700 dark:text-ink-50">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rifq-500" />
              {a}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-center text-[11px] text-ink-400">
        هذه أداة مسح أولي وليست أداة تشخيص سريري رسمي — يُستكمل القرار دوماً بتقييم الأخصائي المباشر.
      </p>

      <div className="flex gap-2">
        <Button variant="secondary" size="lg" className="flex-1" onClick={() => setStage("select")}>
          <RotateCcw size={18} /> مقياس آخر
        </Button>
        <Button size="lg" className="flex-1" onClick={saveResult} disabled={saving || saved}>
          {saved ? "تم الحفظ في ملف الطفل ✓" : "حفظ النتيجة في ملف الطفل"}
        </Button>
      </div>
    </Card>
  );
}
