-- ============================================================
-- مخطط قاعدة بيانات منصة "رِفق" للتربية الخاصة
-- نفّذ هذا الملف من: Supabase Dashboard > SQL Editor > New query
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

-- ---------- جدول تقييم اللغة والتواصل ----------
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

-- ---------- جدول الجلسات ----------
create table sessions (
  id uuid primary key default uuid_generate_v4(),
  child_id uuid references children(id) on delete cascade not null,
  teacher_id uuid references auth.users(id) not null,
  session_date timestamptz default now(),
  attended boolean default true,
  duration_minutes int default 30,
  behavior_notes text,
  goal_results jsonb default '[]'::jsonb, -- [{goal_id, rating, note}]
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
alter table iep_goals enable row level security;
alter table sessions enable row level security;
alter table lessons enable row level security;
alter table parent_notifications enable row level security;

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
