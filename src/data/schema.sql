-- Supabase 스키마 정의 파일

-- UUID 확장 기능 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users 테이블 생성
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS(Row Level Security) 설정
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 자신의 데이터만 조회/수정할 수 있도록 정책 설정
CREATE POLICY "사용자는 자신의 데이터만 조회 가능" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "사용자는 자신의 데이터만 수정 가능" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 관리자는 모든 데이터 조회 가능
CREATE POLICY "관리자는 모든 사용자 조회 가능" ON public.users
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
  );

-- 관리자는 모든 데이터 수정 가능
CREATE POLICY "관리자는 모든 사용자 수정 가능" ON public.users
  FOR UPDATE USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
  );

-- 2. projects 테이블
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,
  client TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES public.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS 설정
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 프로젝트 생성자는 프로젝트 조회/수정 가능
CREATE POLICY "프로젝트 생성자는 프로젝트 조회 가능" ON public.projects
  FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "프로젝트 생성자는 프로젝트 수정 가능" ON public.projects
  FOR UPDATE USING (auth.uid() = created_by);

-- 프로젝트 참여자는 프로젝트 조회 가능
CREATE POLICY "프로젝트 참여자는 프로젝트 조회 가능" ON public.projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_users
      WHERE project_id = projects.id AND user_id = auth.uid()
    )
  );

-- 관리자는 모든 프로젝트 조회/수정 가능
CREATE POLICY "관리자는 모든 프로젝트 조회 가능" ON public.projects
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
  );

CREATE POLICY "관리자는 모든 프로젝트 수정 가능" ON public.projects
  FOR UPDATE USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
  );

-- 3. project_users 테이블 (Many-to-Many mapping)
CREATE TABLE public.project_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('PMO', 'PM', 'DESIGNER', 'DEVELOPER', 'QA', 'CONSULTANT')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- RLS 설정
ALTER TABLE public.project_users ENABLE ROW LEVEL SECURITY;

-- 프로젝트 생성자는 프로젝트 참여자 조회/수정 가능
CREATE POLICY "프로젝트 생성자는 프로젝트 참여자 조회 가능" ON public.project_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_users.project_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "프로젝트 생성자는 프로젝트 참여자 수정 가능" ON public.project_users
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = project_users.project_id AND created_by = auth.uid()
    )
  );

-- 프로젝트 참여자는 프로젝트의 참여자 목록 조회 가능
CREATE POLICY "프로젝트 참여자는 참여자 목록 조회 가능" ON public.project_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_users
      WHERE project_id = project_users.project_id AND user_id = auth.uid()
    )
  );

-- 관리자는 모든 프로젝트 참여자 조회/수정 가능
CREATE POLICY "관리자는 모든 프로젝트 참여자 조회 가능" ON public.project_users
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
  );

CREATE POLICY "관리자는 모든 프로젝트 참여자 수정 가능" ON public.project_users
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
  );

-- 4. tasks 테이블
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS 설정
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- 프로젝트 생성자는 태스크 조회/수정 가능
CREATE POLICY "프로젝트 생성자는 태스크 조회 가능" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = tasks.project_id AND created_by = auth.uid()
    )
  );

CREATE POLICY "프로젝트 생성자는 태스크 수정 가능" ON public.tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.projects
      WHERE id = tasks.project_id AND created_by = auth.uid()
    )
  );

-- 프로젝트 참여자는 태스크 조회 가능
CREATE POLICY "프로젝트 참여자는 태스크 조회 가능" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.project_users
      WHERE project_id = tasks.project_id AND user_id = auth.uid()
    )
  );

-- 관리자는 모든 태스크 조회/수정 가능
CREATE POLICY "관리자는 모든 태스크 조회 가능" ON public.tasks
  FOR SELECT USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
  );

CREATE POLICY "관리자는 모든 태스크 수정 가능" ON public.tasks
  FOR ALL USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'ADMIN'
  );

-- 인증되지 않은 사용자도 로그인 시도를 위해 사용자 조회 가능
CREATE POLICY "인증되지 않은 사용자도 로그인을 위해 이메일로 사용자 조회 가능" ON public.users
  FOR SELECT USING (true);

-- 테스트 사용자 생성 (admin, user1)
INSERT INTO public.users (email, password, role)
VALUES 
  ('admin@example.com', 'admin123', 'ADMIN'),
  ('user1@example.com', 'user123', 'USER');
