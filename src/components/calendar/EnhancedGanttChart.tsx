
import React, { useState, useRef, useEffect } from "react";
import { GanttTask } from "@/types";
import { format, eachDayOfInterval, isSameDay, addDays, addWeeks, addMonths } from "date-fns";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter,
  differenceInDays,
  isBefore,
  isAfter,
  isSameMonth,
  getWeek
} from "date-fns";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

interface EnhancedGanttChartProps {
  tasks: GanttTask[];
  viewMode: "day" | "week" | "month" | "quarter";
  currentDate: Date;
}

const EnhancedGanttChart: React.FC<EnhancedGanttChartProps> = ({ 
  tasks, 
  viewMode, 
  currentDate 
}) => {
  const timelineRef = useRef<HTMLDivElement>(null);
  const [sortedTasks, setSortedTasks] = useState<GanttTask[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date, end: Date }>({
    start: new Date(),
    end: new Date()
  });
  const [displayDates, setDisplayDates] = useState<Date[]>([]);

  // Get color based on task status
  const getTaskColor = (task: GanttTask) => {
    if (task.type === 'task') {
      return 'bg-blue-500';
    }
    
    switch (task.status) {
      case 'planning':
        return 'bg-blue-500';
      case 'design':
        return 'bg-purple-500';
      case 'development':
        return 'bg-amber-500';
      case 'testing':
        return 'bg-cyan-500';
      case 'completed':
        return 'bg-green-500';
      case 'onhold':
        return 'bg-gray-500';
      default:
        return 'bg-blue-500';
    }
  };

  // Get status label
  const getStatusLabel = (status?: string) => {
    if (!status) return "작업";
    
    switch (status) {
      case 'planning':
        return "계획";
      case 'design':
        return "디자인";
      case 'development':
        return "개발";
      case 'testing':
        return "테스트";
      case 'completed':
        return "완료";
      case 'onhold':
        return "보류";
      default:
        return status;
    }
  };

  // Sort and prepare tasks
  useEffect(() => {
    // Sort tasks by project first, then by start date
    const sorted = [...tasks].sort((a, b) => {
      // First sort by project
      if (a.project !== b.project) {
        return a.project.localeCompare(b.project);
      }
      
      // Then sort by start date
      return a.start.getTime() - b.start.getTime();
    });
    
    setSortedTasks(sorted);
  }, [tasks]);

  // Update date range based on view mode
  useEffect(() => {
    let start: Date, end: Date;
    
    switch (viewMode) {
      case "day":
        start = currentDate;
        end = currentDate;
        break;
      case "week":
        start = startOfWeek(currentDate, { weekStartsOn: 1 });
        end = endOfWeek(currentDate, { weekStartsOn: 1 });
        break;
      case "month":
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
        break;
      case "quarter":
        start = startOfQuarter(currentDate);
        end = endOfQuarter(currentDate);
        break;
      default:
        start = startOfMonth(currentDate);
        end = endOfMonth(currentDate);
    }
    
    // Add padding days to better display the Gantt chart
    start = addDays(start, -2);
    end = addDays(end, 2);
    
    setDateRange({ start, end });
  }, [viewMode, currentDate]);

  // Generate display dates
  useEffect(() => {
    const { start, end } = dateRange;
    const dates = eachDayOfInterval({ start, end });
    setDisplayDates(dates);
  }, [dateRange]);

  // Determine the header format based on the view mode
  const getHeaderFormat = (date: Date) => {
    switch(viewMode) {
      case 'day':
        return {
          primary: format(date, 'MM/dd'),
          secondary: format(date, 'EEEE')
        };
      case 'week':
        return {
          primary: `W${getWeek(date)}`,
          secondary: format(date, 'MM/dd')
        };
      case 'month':
        return {
          primary: format(date, 'MM/dd'),
          secondary: format(date, 'EEE')
        };
      case 'quarter':
        return {
          primary: format(date, 'MM/dd'),
          secondary: format(date, 'EEE')
        };
    }
  };

  // Check if the date is in the range of the task
  const isDateInTaskRange = (date: Date, task: GanttTask) => {
    return (
      (isSameDay(date, task.start) || isAfter(date, task.start)) &&
      (isSameDay(date, task.end) || isBefore(date, task.end))
    );
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const isTaskStart = (date: Date, task: GanttTask) => {
    return isSameDay(date, task.start);
  };

  const isTaskEnd = (date: Date, task: GanttTask) => {
    return isSameDay(date, task.end);
  };

  if (sortedTasks.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        표시할 작업이 없습니다
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[600px] rounded-lg border"
    >
      {/* Fixed left panel */}
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <div className="h-full p-0">
          <div className="bg-muted/50 p-2 font-medium">
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-5">작업</div>
              <div className="col-span-2">담당자</div>
              <div className="col-span-2">상태</div>
              <div className="col-span-1.5">시작일</div>
              <div className="col-span-1.5">종료일</div>
            </div>
          </div>
          <div className="h-[calc(100%-36px)] overflow-y-auto">
            {sortedTasks.map((task) => (
              <div key={task.id} className="border-b p-2 hover:bg-gray-50">
                <div className="grid grid-cols-12 gap-1">
                  <div className="col-span-5 truncate" title={task.name}>
                    {task.name}
                  </div>
                  <div className="col-span-2 text-sm text-gray-700">
                    {task.assignee || (task.project ? "프로젝트" : "작업")}
                  </div>
                  <div className="col-span-2">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getTaskColor(task)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                  </div>
                  <div className="col-span-1.5 text-xs text-gray-700">
                    {format(task.start, 'yyyy-MM-dd')}
                  </div>
                  <div className="col-span-1.5 text-xs text-gray-700">
                    {format(task.end, 'yyyy-MM-dd')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResizablePanel>

      {/* Resize handle */}
      <ResizableHandle withHandle className="bg-gray-200" />

      {/* Scrollable right panel (Gantt chart) */}
      <ResizablePanel defaultSize={70}>
        <div className="h-full relative">
          <div className="bg-muted/50 p-2 overflow-hidden">
            <div className="flex">
              {displayDates.map((date, index) => (
                <div 
                  key={index}
                  className={`flex-shrink-0 flex-grow-0 w-14 text-center text-xs ${
                    isWeekend(date) ? 'bg-gray-100' : 
                    isToday(date) ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="font-medium">{getHeaderFormat(date).primary}</div>
                  <div className="text-gray-500">{getHeaderFormat(date).secondary}</div>
                </div>
              ))}
            </div>
          </div>

          <ScrollArea className="h-[calc(100%-36px)]">
            <div ref={timelineRef} className="relative">
              {sortedTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex border-b hover:bg-gray-50 min-h-[42px] relative"
                >
                  <div className="flex w-full">
                    {displayDates.map((date, dateIndex) => {
                      const isInRange = isDateInTaskRange(date, task);
                      const isStart = isTaskStart(date, task);
                      const isEnd = isTaskEnd(date, task);

                      return (
                        <div 
                          key={dateIndex}
                          className={`flex-shrink-0 flex-grow-0 w-14 h-10 border-r ${
                            isWeekend(date) ? 'bg-gray-100' : 
                            isToday(date) ? 'bg-blue-50' : ''
                          }`}
                        >
                          {isInRange && (
                            <div 
                              className={`h-6 mt-2 ${getTaskColor(task)} ${
                                isStart ? 'rounded-l-md' : ''
                              } ${
                                isEnd ? 'rounded-r-md' : ''
                              }`}
                            >
                              {isStart && (
                                <span className="text-xs text-white ml-1">
                                  {task.progress}%
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Dependencies */}
                  {task.dependencies && task.dependencies.split(',').map(dependencyId => {
                    const dependency = sortedTasks.find(t => t.id === dependencyId.trim());
                    if (!dependency) return null;
                    
                    // Simple line representation of dependency - in a more complex implementation
                    // we would calculate exact positions and draw SVG arrows
                    return (
                      <div 
                        key={`${task.id}-${dependencyId}`} 
                        className="absolute top-1/2 h-0.5 bg-gray-300 z-10"
                        style={{
                          left: '0',
                          width: '100%',
                          transform: 'translateY(-50%)'
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default EnhancedGanttChart;
