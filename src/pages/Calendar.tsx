
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { Navigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format, addDays, addMonths, addWeeks, addQuarters, isToday } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Play
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { GanttTask } from "@/types";
import SimpleGanttChart from "@/components/calendar/SimpleGanttChart";

type ViewMode = "day" | "week" | "month" | "quarter";

const Calendar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { ganttTasks, projects, loading } = useProjects();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<GanttTask[]>([]);
  const isMobile = useIsMobile();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Filter tasks based on search term
  useEffect(() => {
    if (!ganttTasks) return;
    
    const filtered = ganttTasks.filter(task => {
      const projectName = projects.find(p => p.id === task.project)?.name || "";
      const taskName = task.name.toLowerCase();
      const projectNameLower = projectName.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      
      return taskName.includes(searchTermLower) || projectNameLower.includes(searchTermLower);
    });
    
    setFilteredTasks(filtered);
  }, [searchTerm, ganttTasks, projects]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());
  
  const goNext = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case "quarter":
        setCurrentDate(addQuarters(currentDate, 1));
        break;
    }
  };
  
  const goPrevious = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(addDays(currentDate, -1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, -1));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, -1));
        break;
      case "quarter":
        setCurrentDate(addQuarters(currentDate, -1));
        break;
    }
  };

  // Format date for display
  const formatViewDateRange = () => {
    switch (viewMode) {
      case "day":
        return format(currentDate, "yyyy-MM-dd");
      case "week":
        const weekStart = addDays(currentDate, -currentDate.getDay() + 1);
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, "yy-MM-dd")} ~ ${format(weekEnd, "yy-MM-dd")}`;
      case "month":
        return format(currentDate, "yyyy-MM");
      case "quarter":
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        return `${currentDate.getFullYear()}년 ${quarter}분기`;
    }
  };

  // Get task status color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-600 text-white';
      case 'design': return 'bg-purple-600 text-white';
      case 'development': return 'bg-amber-500 text-white';
      case 'testing': return 'bg-cyan-500 text-white';
      case 'completed': return 'bg-green-600 text-white';
      case 'onhold': return 'bg-gray-500 text-white';
      default: return 'bg-blue-600 text-white';
    }
  };

  // Get status label in Korean
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'planning': return '계획';
      case 'design': return '디자인';
      case 'development': return '개발';
      case 'testing': return '테스트';
      case 'completed': return '완료';
      case 'onhold': return '보류';
      default: return '진행';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">간트차트</h2>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-md border">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="업무명 또는 업무번호를 검색하세요"
            className="pl-8 pr-16"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button 
            variant="secondary" 
            size="sm" 
            className="absolute right-1 top-1"
          >
            검색
          </Button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <span className="flex items-center gap-1">
              <input 
                type="checkbox" 
                className="h-4 w-4 rounded border-gray-300" 
                checked 
                readOnly
              />
              <span className="text-xs">모두 펼치기</span>
            </span>
          </Button>

          <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <SelectTrigger className="w-[100px] h-9">
              <SelectValue placeholder="일" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">일</SelectItem>
              <SelectItem value="week">주</SelectItem>
              <SelectItem value="month">월</SelectItem>
              <SelectItem value="quarter">분기</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" className="h-9 w-9">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z"/>
              <path d="M12 9v6"/>
              <path d="M9 12h6"/>
            </svg>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Card className="p-0 overflow-hidden">
        <SimpleGanttChart 
          tasks={filteredTasks}
          currentDate={currentDate}
          viewMode={viewMode}
        />
      </Card>
    </div>
  );
};

export default Calendar;
