
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useProjects } from "@/context/ProjectContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
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
  Search
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";

type ViewMode = "day" | "week" | "month" | "quarter";

const Calendar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { ganttTasks, projects, loading } = useProjects();
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [projectNameFilter, setProjectNameFilter] = useState("");
  const [managerFilter, setManagerFilter] = useState("");
  const ganttContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

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
        return format(currentDate, "yyyy년 MM월 dd일");
      case "week":
        const weekStart = addDays(currentDate, -currentDate.getDay() + 1);
        const weekEnd = addDays(weekStart, 6);
        return `${format(weekStart, "yyyy년 MM월 dd일")} ~ ${format(weekEnd, "MM월 dd일")}`;
      case "month":
        return format(currentDate, "yyyy년 MM월");
      case "quarter":
        const quarter = Math.floor(currentDate.getMonth() / 3) + 1;
        return `${currentDate.getFullYear()}년 ${quarter}분기`;
    }
  };

  // Filter tasks based on search filters
  const filteredTasks = ganttTasks.filter(task => {
    // Get the project for this task
    const project = projects.find(p => p.id === task.project);
    
    if (!project) return false;
    
    // Filter by project name
    if (projectNameFilter && !project.name.toLowerCase().includes(projectNameFilter.toLowerCase())) {
      return false;
    }
    
    // Filter by manager (createdBy in our case, since we don't have explicit manager field)
    if (managerFilter && !project.createdBy.toLowerCase().includes(managerFilter.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Get task status color
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

  // Calculate task days in current view
  const getTaskDaysForCurrentView = (task: any) => {
    const result = [];
    let currentDay = new Date(task.start);
    
    while (currentDay <= task.end) {
      result.push(new Date(currentDay));
      currentDay = addDays(currentDay, 1);
    }
    
    return result;
  };

  // Get dates for current view
  const getDatesForCurrentView = () => {
    let startDate: Date;
    let endDate: Date;
    
    switch (viewMode) {
      case "day":
        startDate = currentDate;
        endDate = currentDate;
        break;
      case "week":
        startDate = addDays(currentDate, -currentDate.getDay() + 1); // Monday
        endDate = addDays(startDate, 6); // Sunday
        break;
      case "month":
        startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        break;
      case "quarter":
        const quarter = Math.floor(currentDate.getMonth() / 3);
        startDate = new Date(currentDate.getFullYear(), quarter * 3, 1);
        endDate = new Date(currentDate.getFullYear(), quarter * 3 + 3, 0);
        break;
    }
    
    const result = [];
    let current = new Date(startDate);
    
    while (current <= endDate) {
      result.push(new Date(current));
      current = addDays(current, 1);
    }
    
    return result;
  };

  // Format date for column header based on view mode
  const formatColumnDate = (date: Date) => {
    switch (viewMode) {
      case "day":
        return format(date, "HH:mm");
      case "week":
      case "month":
        return format(date, "dd");
      case "quarter":
        return format(date, "MM/dd");
    }
  };

  // Get manager name for a task's project
  const getManagerForTask = (task: any) => {
    const project = projects.find(p => p.id === task.project);
    return project ? project.createdBy : 'Unknown';
  };

  // Desktop view
  const renderDesktopView = () => {
    const dates = getDatesForCurrentView();
    
    return (
      <div className="flex flex-col h-full">
        {/* Fixed filters section */}
        <div className="flex flex-col gap-4 mb-4 bg-background sticky top-0 z-10 pb-2 pt-1 border-b">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium">{formatViewDateRange()}</span>
              <Button variant="outline" size="sm" onClick={goNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={goToToday} className="whitespace-nowrap">
                <CalendarIcon className="h-4 w-4 mr-1" />
                오늘
              </Button>
              
              <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="View mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">일 보기</SelectItem>
                  <SelectItem value="week">주 보기</SelectItem>
                  <SelectItem value="month">월 보기</SelectItem>
                  <SelectItem value="quarter">분기 보기</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 md:gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="프로젝트명 검색..."
                className="pl-8"
                value={projectNameFilter}
                onChange={(e) => setProjectNameFilter(e.target.value)}
              />
            </div>
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="담당자 검색..."
                className="pl-8"
                value={managerFilter}
                onChange={(e) => setManagerFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Main gantt chart area */}
        <div className="flex flex-col flex-1 h-[calc(100%-100px)] border rounded-md">
          <div className="flex border-b">
            {/* Left header */}
            <div className="flex-none w-80 border-r p-2 font-medium bg-muted/30">
              <div className="grid grid-cols-12 gap-1">
                <div className="col-span-5">프로젝트</div>
                <div className="col-span-3">담당자</div>
                <div className="col-span-2">시작일</div>
                <div className="col-span-2">종료일</div>
              </div>
            </div>
            
            {/* Right header (dates) */}
            <div className="flex-1 overflow-hidden">
              <div className="flex">
                {dates.map((date, i) => (
                  <div
                    key={i}
                    className={`flex-none w-14 p-2 text-center border-r text-xs font-medium
                      ${isToday(date) ? 'bg-blue-100' : 
                      date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-100' : 'bg-muted/30'}`}
                  >
                    <div>{formatColumnDate(date)}</div>
                    <div className="text-muted-foreground">{format(date, "E")}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex flex-1 min-h-0">
            {/* Left project list */}
            <div className="flex-none w-80 border-r overflow-y-auto">
              {filteredTasks.map((task) => (
                <div key={task.id} className="border-b p-2 hover:bg-muted/10">
                  <div className="grid grid-cols-12 gap-1">
                    <div className="col-span-5 truncate" title={task.name}>
                      {task.name}
                    </div>
                    <div className="col-span-3 truncate" title={getManagerForTask(task)}>
                      {getManagerForTask(task)}
                    </div>
                    <div className="col-span-2 text-xs">
                      {format(task.start, 'MM/dd')}
                    </div>
                    <div className="col-span-2 text-xs">
                      {format(task.end, 'MM/dd')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Right gantt chart */}
            <div className="flex-1 overflow-hidden" ref={ganttContainerRef}>
              <ScrollArea className="h-full" orientation="horizontal">
                <div className="flex flex-col">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="flex border-b min-h-[41px] hover:bg-muted/10">
                      {dates.map((date, dateIndex) => {
                        const isInTaskRange = task.start <= date && task.end >= date;
                        const isTaskStart = date.toDateString() === task.start.toDateString();
                        const isTaskEnd = date.toDateString() === task.end.toDateString();
                        
                        return (
                          <div 
                            key={dateIndex} 
                            className={`flex-none w-14 h-[41px] border-r ${
                              isToday(date) ? 'bg-blue-50' : 
                              date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-100' : ''
                            }`}
                          >
                            {isInTaskRange && (
                              <div 
                                className={`mt-2 h-6 ${getTaskStatusColor(task.status)} ${
                                  isTaskStart ? 'rounded-l-md pl-1' : ''
                                } ${
                                  isTaskEnd ? 'rounded-r-md' : ''
                                }`}
                              >
                                {isTaskStart && (
                                  <span className="text-xs text-white pl-1">
                                    {task.progress}%
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Mobile view - simplified version
  const renderMobileView = () => {
    return (
      <div className="flex flex-col">
        {/* Mobile filters - fixed at top */}
        <div className="flex flex-col gap-4 mb-4 bg-background sticky top-0 z-10 pb-2 pt-1 border-b">
          <div className="flex items-center justify-between mb-2">
            <Select value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="View mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">일 보기</SelectItem>
                <SelectItem value="week">주 보기</SelectItem>
                <SelectItem value="month">월 보기</SelectItem>
                <SelectItem value="quarter">분기 보기</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" onClick={goPrevious}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goToToday}>
                <CalendarIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={goNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-center font-medium mb-2">
            {formatViewDateRange()}
          </div>
          
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="프로젝트 또는 담당자 검색..."
              className="pl-8"
              value={projectNameFilter}
              onChange={(e) => {
                setProjectNameFilter(e.target.value);
                setManagerFilter(e.target.value); // In mobile, search both fields with one input
              }}
            />
          </div>
        </div>
        
        {/* Mobile task list with simple gantt visualization */}
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex justify-between mb-1">
                  <div className="font-medium truncate flex-1" title={task.name}>
                    {task.name}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs text-white ${getTaskStatusColor(task.status)}`}>
                    {task.status || 'Task'}
                  </div>
                </div>
                
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <div>{getManagerForTask(task)}</div>
                  <div>{format(task.start, 'yyyy-MM-dd')} ~ {format(task.end, 'yyyy-MM-dd')}</div>
                </div>
                
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full ${getTaskStatusColor(task.status)}`} 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-right mt-1">{task.progress}%</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">일정</h2>
        <p className="text-muted-foreground">
          프로젝트 일정을 확인하세요
        </p>
      </div>

      {isMobile ? renderMobileView() : renderDesktopView()}
    </div>
  );
};

export default Calendar;
