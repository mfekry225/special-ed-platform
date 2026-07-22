import { GoalBuilder } from "@/components/iep/GoalBuilder";

export default function IEPPage({ params }: { params: { childId: string } }) {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-extrabold text-ink-900 dark:text-ink-50">
          الخطة التربوية الفردية — يوسف أحمد
        </h1>
        <p className="text-sm text-ink-400">حدّد الأهداف قصيرة وطويلة المدى ومؤشرات القياس الخاصة بها</p>
      </div>
      <GoalBuilder childId={params.childId} />
    </div>
  );
}
