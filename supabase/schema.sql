-- ============================================================
-- مخطط قاعدة بيانات منصة "رِفق" للتربية الخاصة
-- نفّذ هذا الملف من: Supabase Dashboard > SQL Editor > New query
--
-- ملاحظة: جداول clinical_screenings, enrollment_leads,
-- absence_excuse_requests, timeline_milestones, teacher_profiles
-- مستوحاة من نموذج بيانات مشروع المستخدم السابق "أُفق"، وأُعيد بناؤها
-- هنا بصيغة Postgres + سياسات RLS بدل Firestore المفتوح بلا حماية.
-- ============================================================

-- تفعيل امتداد توليد المعرّفات الفريدة
create extension if not exists "uuid-ossp";

-- ---------- جدول الأطفال ----------
create table children (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references auth.users(id) not null,
  full_name text not null,
  birth_date date not null,
  diagnosis text not null check (diagnosis in
    ('تأخر_لغوي','طيف_التوحد','صعوبات_تواصل','متلازمة_داون','إعاقة_سمعية','أخرى')),
  guardian_name text not null,
  guardian_phone text not null,
  guardian_user_id uuid references auth.users(id), -- لربط حساب ولي الأمر بالبوابة
  avatar_url text,
  created_at timestamptz default now()
);

-- ---------- جدول تقييم اللغة والتواصل (تقدير سريع بالشرائح — يُستخدم في نظرة عامة سريعة) ----------
create table language_assessments (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade not null,
  assessment_date date default current_date,
  receptive_language_score int check (receptive_language_score between 0 and 100),
  expressive_language_score int check (expressive_language_score between 0 and 100),
  social_communication_score int check (social_communication_score between 0 and 100),
  articulation_notes text,
  overall_level text check (overall_level in ('مبتدئ','نامٍ','متقدم','قريب_من_العمر_الزمني')),
  created_at timestamptz default now()
);

-- ---------- جدول نتائج المقاييس الإكلينيكية الأربعة (مستنسخة من بنك أُفق) ----------
-- كل مقياس من 10 بنود، كل بند له إجابة من 0-3 (لا/نادراً/أحياناً/غالباً) أو ما يعادلها
create table clinical_screenings (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade not null,
  scale_id text not null check (scale_id in
    ('language','autism','developmental_learning','stuttering')),
  answers jsonb not null default '[]'::jsonb, -- [{question_id, score}]
  total_score int not null,
  interpretation_level text not null check (interpretation_level in ('low','moderate','high')),
  screened_by uuid references auth.users(id) not null,
  created_at timestamptz default now()
);

-- ---------- جدول استقطاب عملاء جدد (مستلهم من "Leads" في أُفق) ----------
-- مفيد لصفحة هبوط عامة لكل أخصائي يعرض فيها خدماته ويستقبل طلبات تواصل أولياء أمور جدد
create table enrollment_leads (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references auth.users(id) not null,
  parent_name text not null,
  student_name text not null,
  student_age text,
  subject_needed text,
  phone text not null,
  preferred_time text,
  notes text,
  status text default 'جديد' check (status in ('جديد','تم_التواصل','تم_التسجيل','ملغي')),
  created_at timestamptz default now()
);

-- ---------- جدول طلبات استئذان الغياب (من ولي الأمر) ----------
create table absence_excuse_requests (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade not null,
  session_date date not null,
  reason text not null,
  suggested_alternative_date date,
  status text default 'قيد_الانتظار' check (status in ('قيد_الانتظار','مقبول','مرفوض')),
  created_at timestamptz default now()
);

-- ---------- جدول الخط الزمني للإنجازات (يُعرض في بوابة ولي الأمر) ----------
create table timeline_milestones (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade not null,
  milestone_date date default current_date,
  title text not null,
  description text,
  level_badge text,
  type text check (type in ('إنجاز','ترقية_مستوى','تقييم','محطة_فارقة')),
  created_at timestamptz default now()
);

-- ---------- جدول الملف التعريفي العام للأخصائي (صفحة هبوط لكل أخصائي) ----------
-- يُفتح لاحقاً عند التوسع لمنصة متعددة الأخصائيين، كل أخصائي له رابط عام خاص به
create table teacher_profiles (
  teacher_id uuid primary key references auth.users(id),
  display_name text not null,
  title text, -- مثال: أخصائية تخاطب وتنمية مهارات
  tagline text,
  bio text,
  experience_years int,
  location text,
  phone text,
  whatsapp text,
  subjects text[] default '{}',
  slug text unique, -- الرابط العام: rifq.app/@slug
  updated_at timestamptz default now()
);

-- ---------- جدول أهداف الخطة التربوية الفردية (IEP) ----------
create table iep_goals (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade not null,
  term text not null check (term in ('قصير_المدى','طويل_المدى')),
  domain text not null check (domain in ('لغوي','تواصل_اجتماعي','سلوكي','حركي','معرفي')),
  title text not null,
  description text,
  kpi text not null,
  target_date date,
  status text default 'لم_يبدأ' check (status in ('لم_يبدأ','قيد_التقدم','مكتسب','بحاجة_مراجعة')),
  progress_percent int default 0 check (progress_percent between 0 and 100),
  created_at timestamptz default now()
);

-- ---------- جدول الجلسات (موسّع بثلاث مراحل: قبل / أثناء / بعد الجلسة) ----------
-- الفكرة مستلهمة من نموذج بيانات مشروع "أُفق" السابق — هيكلة أدق من حقل ملاحظات واحد
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade not null,
  teacher_id uuid references auth.users(id) not null,
  session_number int,
  session_date timestamptz default now(),
  duration_minutes int default 30,
  attended boolean default true,
  status text default 'حضر' check (status in ('حضر','غائب','غياب_بعذر','مجدولة')),

  -- 1) قبل الجلسة
  pre_session_notes text,
  previous_homework_status text check (previous_homework_status in
    ('مكتمل','جزئي','لم_ينفَّذ','لا_يوجد_واجب')),

  -- 2) أثناء الجلسة
  topic text,
  goal_results jsonb default '[]'::jsonb, -- [{goal_id, rating, note}]
  engagement_score int check (engagement_score between 1 and 5), -- درجة التفاعل

  -- 3) بعد الجلسة والتقييم
  understanding_score int check (understanding_score between 1 and 5),
  student_strengths text,
  areas_to_improve text,
  next_plan text,
  homework_assigned text,
  teacher_note_to_parent text,

  homework_lesson_id uuid,
  shared_with_parent boolean default false,
  created_at timestamptz default now()
);

-- ---------- جدول الدروس والأنشطة ----------
create table lessons (
  id uuid primary key default uuid_generate_v4(),
  teacher_id uuid references auth.users(id) not null,
  title text not null,
  domain text not null check (domain in ('لغوي','تواصل_اجتماعي','سلوكي','حركي','معرفي')),
  description text,
  resource_url text,
  assigned_child_ids uuid[] default '{}',
  created_at timestamptz default now()
);

-- ---------- جدول إشعارات أولياء الأمور ----------
create table parent_notifications (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade not null,
  channel text not null check (channel in ('whatsapp','in_app')),
  message text not null,
  sent_at timestamptz default now(),
  read boolean default false
);

-- ============================================================
-- سياسات أمان مستوى الصف (Row Level Security)
-- كل معلم يرى فقط بيانات أطفاله، وكل ولي أمر يرى فقط بيانات طفله
-- ============================================================

alter table children enable row level security;
alter table language_assessments enable row level security;
alter table clinical_screenings enable row level security;
alter table iep_goals enable row level security;
alter table sessions enable row level security;
alter table lessons enable row level security;
alter table parent_notifications enable row level security;
alter table enrollment_leads enable row level security;
alter table absence_excuse_requests enable row level security;
alter table timeline_milestones enable row level security;
alter table teacher_profiles enable row level security;

-- المعلّم يدير أطفاله فقط
create policy "المعلم يرى أطفاله" on children
  for select using (auth.uid() = teacher_id or auth.uid() = guardian_user_id);
create policy "المعلم يضيف أطفالاً" on children
  for insert with check (auth.uid() = teacher_id);
create policy "المعلم يعدّل أطفاله" on children
  for update using (auth.uid() = teacher_id);

-- التقييمات وأهداف الخطة والجلسات: مرتبطة بالطفل الذي يملكه المعلم
create policy "الوصول عبر ملكية الطفل - assessments" on language_assessments
  for all using (
    exists (select 1 from children c where c.id = child_id
      and (c.teacher_id = auth.uid() or c.guardian_user_id = auth.uid()))
  );

create policy "الوصول عبر ملكية الطفل - iep_goals" on iep_goals
  for all using (
    exists (select 1 from children c where c.id = child_id
      and (c.teacher_id = auth.uid() or c.guardian_user_id = auth.uid()))
  );

create policy "الوصول عبر ملكية الطفل - sessions" on sessions
  for all using (
    exists (select 1 from children c where c.id = child_id
      and (c.teacher_id = auth.uid() or c.guardian_user_id = auth.uid()))
  );

create policy "المعلم يدير دروسه" on lessons
  for all using (auth.uid() = teacher_id);

create policy "الوصول لإشعارات الطفل" on parent_notifications
  for all using (
    exists (select 1 from children c where c.id = child_id
      and (c.teacher_id = auth.uid() or c.guardian_user_id = auth.uid()))
  );

create policy "الوصول عبر ملكية الطفل - clinical_screenings" on clinical_screenings
  for all using (
    exists (select 1 from children c where c.id = child_id
      and (c.teacher_id = auth.uid() or c.guardian_user_id = auth.uid()))
  );

-- الأخصائي يدير عملاءه المحتملين فقط (لا علاقة بجدول children بعد، فالطفل لم يُسجَّل بعد)
create policy "الأخصائي يدير عملاءه المحتملين" on enrollment_leads
  for all using (auth.uid() = teacher_id);

create policy "الوصول عبر ملكية الطفل - absence_requests" on absence_excuse_requests
  for all using (
    exists (select 1 from children c where c.id = child_id
      and (c.teacher_id = auth.uid() or c.guardian_user_id = auth.uid()))
  );

create policy "الوصول عبر ملكية الطفل - timeline" on timeline_milestones
  for all using (
    exists (select 1 from children c where c.id = child_id
      and (c.teacher_id = auth.uid() or c.guardian_user_id = auth.uid()))
  );

-- الملف التعريفي للأخصائي: هو فقط يعدّله، لكن أي شخص (حتى غير مسجّل) يمكنه قراءته
-- لأنه صفحة هبوط عامة تُستخدم لاستقطاب عملاء جدد
create policy "الأخصائي يعدّل ملفه الشخصي" on teacher_profiles
  for all using (auth.uid() = teacher_id);
create policy "أي شخص يقرأ الملف التعريفي العام" on teacher_profiles
  for select using (true);
