"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface GoalDraft {
  id: string;
  term: "قصير_المدى" | "طويل_المدى";
  domain: string;
  title: string;
  kpi: string;
  targetDate: string;
}

const domains = ["لغوي", "تواصل_اجتماعي", "سلوكي", "حركي", "معرفي"];

export function GoalBuilder({ childId }: { childId: string }) {
  const [goals, setGoals] = useState<GoalDraft[]>([
    { id: crypto.randomUUID(), term: "قصير_المدى", domain: "لغوي", title: "", kpi: "", targetDate: "" },
  ]);

  function addGoal(term: GoalDraft["term"]) {
    setGoals((g) => [
      ...g,
      { id: crypto.randomUUID(), term, domain: "لغوي", title: "", kpi: "", targetDate: "" },
    ]);
  }

  function updateGoal(id: string, patch: Partial<GoalDraft>) {
    setGoals((g) => g.map((goal) => (goal.id === id ? { ...goal, ...patch } : goal)));
  }

  function removeGoal(id: string) {
    setGoals((g) => g.filter((goal) => goal.id !== id));
  }

  const shortTerm = goals.filter((g) => g.term === "قصير_المدى");
  const longTerm = goals.filter((g) => g.term === "طويل_المدى");

  return (
    <div className="space-y-6">
      {(["قصير_المدى", "طويل_المدى"] as const).map((term) => (
        <div key={term}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display font-bold text-ink-900 dark:text-ink-50">
              {term === "قصير_المدى" ? "الأهداف قصيرة المدى (فصلية)" : "الأهداف طويلة المدى (سنوية)"}
            </h3>
            <button
              onClick={() => addGoal(term)}
              className="touch-target flex items-center gap-1 text-xs font-bold text-rifq-500"
            >
              <Plus size={16} /> إضافة هدف
            </button>
          </div>

          <div className="space-y-3">
            {(term === "قصير_المدى" ? shortTerm : longTerm).map((goal) => (
              <Card key={goal.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {domains.map((d) => (
                      <button
                        key={d}
                        onClick={() => updateGoal(goal.id, { domain: d })}
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-bold",
                          goal.domain === d
                            ? "bg-rifq-500 text-white"
                            : "bg-ink-100 text-ink-700 dark:bg-dark-border dark:text-ink-50"
                        )}
                      >
                        {d.replaceAll("_", " ")}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => removeGoal(goal.id)} className="touch-target text-coral-500">
                    <Trash2 size={17} />
                  </button>
                </div>

                <input
                  value={goal.title}
                  onChange={(e) => updateGoal(goal.id, { title: e.target.value })}
                  placeholder="نص الهدف — مثال: نطق أسماء 10 أشياء شائعة بشكل مستقل"
                  className="w-full rounded-xl2 border border-ink-100 bg-ink-50 p-3 text-sm outline-none focus:border-rifq-400 dark:border-dark-border dark:bg-dark-bg"
                />

                <textarea
                  value={goal.kpi}
                  onChange={(e) => updateGoal(goal.id, { kpi: e.target.value })}
                  placeholder="مؤشر قياس الأداء (KPI) — مثال: ينطق 8 من 10 كلمات مستهدفة دون مساعدة في جلستين متتاليتين"
                  rows={2}
                  className="w-full rounded-xl2 border border-ink-100 bg-ink-50 p-3 text-sm outline-none focus:border-rifq-400 dark:border-dark-border dark:bg-dark-bg"
                />

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-ink-400">تاريخ الإنجاز المستهدف:</label>
                  <input
                    type="date"
                    value={goal.targetDate}
                    onChange={(e) => updateGoal(goal.id, { targetDate: e.target.value })}
                    className="rounded-xl2 border border-ink-100 bg-ink-50 p-2 text-sm outline-none dark:border-dark-border dark:bg-dark-bg"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Button size="lg" className="w-full">
        حفظ الخطة التربوية الفردية
      </Button>
    </div>
  );
}
