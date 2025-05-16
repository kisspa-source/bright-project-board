
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
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns";
import EnhancedGanttChart from "@/components/calendar/EnhancedGanttChart";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

type ViewMode = "day" | "week" | "month" | "quarter";

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
      case "day":
        return { start: currentDate, end: currentDate };
      case "week":
        return { 
          start: startOfWeek(currentDate, { weekStartsOn: 1 }), 
          end: endOfWeek(currentDate, { weekStartsOn: 1 }) 
        };
      case "month":
        return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
      case "quarter":
        return { start: startOfQuarter(currentDate), end: endOfQuarter(currentDate) };
      default:
        return { start: startOfMonth(currentDate), end: endOfMonth(currentDate) };
    }
  };

  // Navigation functions
  const goToToday = () => setCurrentDate(new Date());
  
  const goNext = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addDays(currentDate, 7));
        break;
      case "month":
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
        break;
      case "quarter":
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 3)));
        break;
    }
  };
  
  const goPrevious = () => {
    switch (viewMode) {
      case "day":
        setCurrentDate(addDays(currentDate, -1));
        break;
      case "week":
        setCurrentDate(addDays(currentDate, -7));
        break;
      case "month":
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));
        break;
      case "quarter":
        setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 3)));
        break;
    }
  };

  // Format the date range for display
  const formatDateRange = () => {
    const { start, end } = getDateRange();
    if (viewMode === "day") {
      return format(start, "yyyy년 MM월 dd일");
    }
    return `${format(start, "yyyy년 MM월 dd일")} ~ ${format(end, "yyyy년 MM월 dd일")}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">일정</h2>
        <p className="text-muted-foreground">
          전체 프로젝트 일정을 확인하세요
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
                <SelectItem value="day">일별 보기</SelectItem>
                <SelectItem value="week">주별 보기</SelectItem>
                <SelectItem value="month">월별 보기</SelectItem>
                <SelectItem value="quarter">분기별 보기</SelectItem>
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
          
          <EnhancedGanttChart 
            tasks={ganttTasks} 
            viewMode={viewMode} 
            currentDate={currentDate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
