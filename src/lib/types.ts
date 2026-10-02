// أنواع البيانات الأساسية في منصة "رِفق"
// تتطابق مع مخطط قاعدة البيانات في supabase/schema.sql

export type DiagnosisType =
  | "تأخر_لغوي"
  | "طيف_التوحد"
  | "صعوبات_تواصل"
  | "متلازمة_داون"
  | "إعاقة_سمعية"
  | "أخرى";

export interface Child {
  id: string;
  full_name: string;
  birth_date: string; // ISO date
  diagnosis: DiagnosisType;
  guardian_name: string;
  guardian_phone: string; // لإرسال إشعارات واتساب
  avatar_url?: string | null;
  teacher_id: string;
  created_at: string;
}

export interface LanguageAssessment {
  id: string;
  child_id: string;
  assessment_date: string;
  receptive_language_score: number; // من 100: الفهم/الاستيعاب
  expressive_language_score: number; // من 100: التعبير/النطق
  social_communication_score: number; // من 100: التواصل الاجتماعي
  articulation_notes: string;
  overall_level: "مبتدئ" | "نامٍ" | "متقدم" | "قريب_من_العمر_الزمني";
}

export type GoalStatus = "لم_يبدأ" | "قيد_التقدم" | "مكتسب" | "بحاجة_مراجعة";

export interface IEPGoal {
  id: string;
  child_id: string;
  term: "قصير_المدى" | "طويل_المدى";
  domain: "لغوي" | "تواصل_اجتماعي" | "سلوكي" | "حركي" | "معرفي";
  title: string;
  description: string;
  kpi: string; // مؤشر قياس الأداء، مثال: "ينطق 8 من 10 كلمات مستهدفة دون مساعدة"
  target_date: string;
  status: GoalStatus;
  progress_percent: number; // 0-100
}

export interface SessionGoalResult {
  goal_id: string;
  rating: "لم_يستجب" | "بمساعدة_كاملة" | "بمساعدة_جزئية" | "مستقل"; // مقياس أداء الجلسة
  note?: string;
}

export interface Session {
  id: string;
  child_id: string;
  teacher_id: string;
  session_date: string;
  attended: boolean;
  duration_minutes: number;
  behavior_notes: string;
  goal_results: SessionGoalResult[];
  homework_lesson_id?: string | null;
  shared_with_parent: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  domain: IEPGoal["domain"];
  description: string;
  resource_url?: string | null;
  assigned_child_ids: string[];
}

export interface ParentNotification {
  id: string;
  child_id: string;
  channel: "whatsapp" | "in_app";
  message: string;
  sent_at: string;
  read: boolean;
}

// ---------- أنواع مُستنسخة ومُكيَّفة من نموذج بيانات مشروع "أُفق" السابق ----------

export interface ClinicalScreening {
  id: string;
  child_id: string;
  scale_id: "language" | "autism" | "developmental_learning" | "stuttering";
  answers: { question_id: number; score: number }[];
  total_score: number;
  interpretation_level: "low" | "moderate" | "high";
  screened_by: string;
  created_at: string;
}

export interface EnrollmentLead {
  id: string;
  teacher_id: string;
  parent_name: string;
  student_name: string;
  student_age?: string;
  subject_needed?: string;
  phone: string;
  preferred_time?: string;
  notes?: string;
  status: "جديد" | "تم_التواصل" | "تم_التسجيل" | "ملغي";
  created_at: string;
}

export interface AbsenceExcuseRequest {
  id: string;
  child_id: string;
  session_date: string;
  reason: string;
  suggested_alternative_date?: string;
  status: "قيد_الانتظار" | "مقبول" | "مرفوض";
  created_at: string;
}

export interface TimelineMilestone {
  id: string;
  child_id: string;
  milestone_date: string;
  title: string;
  description?: string;
  level_badge?: string;
  type: "إنجاز" | "ترقية_مستوى" | "تقييم" | "محطة_فارقة";
  created_at: string;
}

export interface TeacherPublicProfile {
  teacher_id: string;
  display_name: string;
  title?: string;
  tagline?: string;
  bio?: string;
  experience_years?: number;
  location?: string;
  phone?: string;
  whatsapp?: string;
  subjects: string[];
  slug?: string;
  updated_at: string;
}
