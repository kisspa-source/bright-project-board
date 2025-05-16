
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

type ViewMode = "week" | "month";

const Calendar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { ganttTasks, loading } = useProjects();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Get date range based on view mode
  const getDateRange = () => {
    switch (viewMode) {
      case "week":
        return { 
          start: startOfWeek(currentDate, { weekStartsOn: 1 }), 
          end: endOfWeek(currentDate, { weekStartsOn: 1 }) 
        };
      case "month":
      default:
        return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
    }
  };

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());
  
  const goNext = () => {
    if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, 7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    }
  };
  
  const goPrevious = () => {
    if (viewMode === "week") {
      setCurrentDate(addDays(currentDate, -7));
    } else {
      setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    }
  };

  // Format the date range for display
  const formatDateRange = () => {
    const { start, end } = getDateRange();
    return `${format(start, "yyyy년 MM월 dd일")} ~ ${format(end, "yyyy년 MM월 dd일")}`;
  };

  // Simple task rendering function
  const renderTasks = () => {
    const { start, end } = getDateRange();
    const filteredTasks = ganttTasks.filter(task => {
      return task.start <= end && task.end >= start;
    });

    return filteredTasks.map(task => (
      <div key={task.id} className="border p-3 rounded-md mb-2">
        <div className="font-medium">{task.name}</div>
        <div className="text-sm text-gray-500 flex justify-between">
          <span>{format(task.start, "yyyy-MM-dd")}</span>
          <span>{task.assignee || "미배정"}</span>
          <span>{format(task.end, "yyyy-MM-dd")}</span>
        </div>
        <div className="mt-1">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className={`h-full rounded-full ${getTaskStatusColor(task.status)}`} 
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    ));
  };

  // Get color based on task status
  const getTaskStatusColor = (status?: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-500';
      case 'design': return 'bg-purple-500';
      case 'development': return 'bg-amber-500';
      case 'testing': return 'bg-cyan-500';
      case 'completed': return 'bg-green-500';
      case 'onhold': return 'bg-gray-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">일정</h2>
        <p className="text-muted-foreground">
          프로젝트 일정을 확인하세요
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>프로젝트 일정</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToToday}
              className="flex items-center gap-1"
            >
              <CalendarIcon className="h-4 w-4" />
              오늘
            </Button>
            
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="보기 방식" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">주별 보기</SelectItem>
                <SelectItem value="month">월별 보기</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={goPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">{formatDateRange()}</span>
              <Button variant="outline" size="icon" onClick={goNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            {renderTasks()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
