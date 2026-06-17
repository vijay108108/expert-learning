create extension if not exists pgcrypto;

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  phone text,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  course text,
  message text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  kind text not null check (kind in ('course', 'program')),
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references products(id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text,
  duration_label text,
  level_label text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  product_id uuid unique references products(id) on delete set null,
  slug text not null unique,
  title text not null,
  description text,
  duration_label text,
  level_label text,
  active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists program_courses (
  program_id uuid not null references programs(id) on delete cascade,
  course_id uuid not null references courses(id) on delete cascade,
  position int not null default 1,
  created_at timestamptz default now(),
  primary key (program_id, course_id)
);

create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references students(id),
  product_id uuid references products(id) on delete set null,
  enrollment_type text not null default 'course' check (enrollment_type in ('course', 'program')),
  course_slug text,
  program_slug text,
  purchased_offering_slug text,
  program_name text,
  program_course_slugs text[] not null default '{}',
  primary_course_slug text,
  amount integer,
  payment_id text,
  status text default 'active',
  enrolled_at timestamptz default now()
);

create table if not exists payment_transactions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  enrollment_id uuid references enrollments(id) on delete set null,
  razorpay_order_id text,
  razorpay_payment_id text,
  invoice_number text,
  amount integer not null,
  currency text not null default 'INR',
  status text not null check (status in ('created', 'captured', 'failed')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create unique index if not exists enrollments_student_program_unique
  on enrollments (student_id, program_slug)
  where enrollment_type = 'program' and status = 'active';

create unique index if not exists enrollments_student_course_unique
  on enrollments (student_id, course_slug)
  where enrollment_type = 'course' and status = 'active';

create unique index if not exists payment_transactions_payment_id_unique
  on payment_transactions (razorpay_payment_id)
  where razorpay_payment_id is not null;
