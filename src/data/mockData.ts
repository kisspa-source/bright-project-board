import { Project, User, GanttTask, DashboardStats } from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    name: '김관리자',
    role: 'admin',
    email: 'admin@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2',
    name: '이매니저',
    role: 'user',
    email: 'manager@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  {
    id: '3',
    name: '박디자이너',
    role: 'user',
    email: 'designer@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '4',
    name: '최개발자',
    role: 'user',
    email: 'developer@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
  },
  {
    id: '5',
    name: '정테스터',
    role: 'user',
    email: 'tester@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
  },
];

// Mock Projects
export const projects: Project[] = [
  {
    id: '1',
    projectCode: 'PRJ-2023-001',
    name: '웹사이트 리뉴얼',
    clientName: '에이콤 기술',
    startDate: '2023-06-01',
    endDate: '2023-08-15',
    status: 'completed',
    designerIds: ['3'],
    developerIds: ['4'],
    createdBy: '2',
    description: 'Company website redesign with new CMS integration',
  },
  {
    id: '2',
    projectCode: 'PRJ-2023-002',
    name: '모바일 앱 개발',
    clientName: '비즈스텝',
    startDate: '2023-07-15',
    endDate: '2023-10-30',
    status: 'development',
    designerIds: ['3'],
    developerIds: ['4'],
    createdBy: '2',
    description: 'iOS and Android app for client customer management',
  },
  {
    id: '3',
    projectCode: 'PRJ-2023-003',
    name: '데이터 대시보드 개발',
    clientName: '디지털허브',
    startDate: '2023-08-01',
    endDate: '2023-09-15',
    status: 'testing',
    designerIds: ['3'],
    developerIds: ['4', '5'],
    createdBy: '2',
    description: 'Analytics dashboard for tracking marketing performance',
  },
  {
    id: '4',
    projectCode: 'PRJ-2023-004',
    name: 'ERP 시스템 업그레이드',
    clientName: '로직스엔터프라이즈',
    startDate: '2023-09-01',
    endDate: '2023-12-15',
    status: 'design',
    designerIds: ['3'],
    developerIds: ['4'],
    createdBy: '2',
    description: 'Upgrade existing ERP to latest version with custom modules',
  },
  {
    id: '5',
    projectCode: 'PRJ-2023-005',
    name: 'CRM 통합 개발',
    clientName: '서비스퍼스트',
    startDate: '2023-10-01',
    endDate: '2024-01-31',
    status: 'planning',
    designerIds: ['3'],
    developerIds: ['4', '5'],
    createdBy: '2',
    description: 'New CRM system with existing tools integration',
  },
];

// Mock Gantt Tasks
export const ganttTasks: GanttTask[] = [
  {
    id: '1',
    name: '웹사이트 리뉴얼',
    start: new Date('2023-06-01'),
    end: new Date('2023-08-15'),
    progress: 100,
    project: '1',
    status: 'completed',
    assignee: '김관리자'
  },
  {
    id: '1.1',
    name: '요구사항 분석',
    start: new Date('2023-06-01'),
    end: new Date('2023-06-10'),
    progress: 100,
    dependencies: '',
    type: 'task',
    project: '1',
    assignee: '이매니저'
  },
  {
    id: '1.2',
    name: 'UI/UX 디자인',
    start: new Date('2023-06-11'),
    end: new Date('2023-07-10'),
    progress: 100,
    dependencies: '1.1',
    type: 'task',
    project: '1',
    assignee: '박디자이너'
  },
  {
    id: '1.3',
    name: '프론트엔드 개발',
    start: new Date('2023-07-11'),
    end: new Date('2023-08-05'),
    progress: 100,
    dependencies: '1.2',
    type: 'task',
    project: '1',
    assignee: '최개발자'
  },
  {
    id: '1.4',
    name: '테스트 및 배포',
    start: new Date('2023-08-06'),
    end: new Date('2023-08-15'),
    progress: 100,
    dependencies: '1.3',
    type: 'task',
    project: '1',
    assignee: '정테스터'
  },
  {
    id: '2',
    name: '모바일 앱 개발',
    start: new Date('2023-07-15'),
    end: new Date('2023-10-30'),
    progress: 65,
    project: '2',
    status: 'development',
    assignee: '김관리자'
  },
  {
    id: '2.1',
    name: '기획 단계',
    start: new Date('2023-07-15'),
    end: new Date('2023-07-25'),
    progress: 100,
    dependencies: '',
    type: 'task',
    project: '2',
    assignee: '이매니저'
  },
  {
    id: '2.2',
    name: 'UI/UX 디자인',
    start: new Date('2023-07-26'),
    end: new Date('2023-08-20'),
    progress: 100,
    dependencies: '2.1',
    type: 'task',
    project: '2',
    assignee: '박디자이너'
  },
  {
    id: '2.3',
    name: 'iOS 개발',
    start: new Date('2023-08-21'),
    end: new Date('2023-10-10'),
    progress: 70,
    dependencies: '2.2',
    type: 'task',
    project: '2',
    assignee: '최개발자'
  },
  {
    id: '2.4',
    name: 'Android 개발',
    start: new Date('2023-08-21'),
    end: new Date('2023-10-10'),
    progress: 60,
    dependencies: '2.2',
    type: 'task',
    project: '2',
    assignee: '최개발자'
  },
  {
    id: '2.5',
    name: '테스트 및 배포',
    start: new Date('2023-10-11'),
    end: new Date('2023-10-30'),
    progress: 0,
    dependencies: '2.3,2.4',
    type: 'task',
    project: '2',
    assignee: '정테스터'
  },
  // Add more tasks for other projects
];

// Mock Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalProjects: projects.length,
  inProgressProjects: projects.filter(p => 
    p.status === 'planning' || 
    p.status === 'design' || 
    p.status === 'development' || 
    p.status === 'testing').length,
  completedProjects: projects.filter(p => p.status === 'completed').length,
  clientCount: [...new Set(projects.map(p => p.clientName))].length,
};

// Helper function to get user by id
export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

// Helper function to get users by ids
export const getUsersByIds = (ids: string[]): User[] => {
  return users.filter(user => ids.includes(user.id));
};

// Current logged in user (for mock purposes)
export const currentUser: User = users[0]; // Default to admin user
