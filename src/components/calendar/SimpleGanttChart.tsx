
import React, { useRef, useState, useEffect } from "react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GanttTask } from "@/types";
import { format, eachDayOfInterval, isSameDay, addDays, isSameMonth, getWeek } from "date-fns";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter,
  isToday
} from "date-fns";
import { Play } from "lucide-react";

interface SimpleGanttChartProps {
  tasks: GanttTask[];
  currentDate: Date;
  viewMode: "day" | "week" | "month" | "quarter";
}

const SimpleGanttChart: React.FC<SimpleGanttChartProps> = ({ 
  tasks, 
  currentDate, 
  viewMode 
}) => {
  const [dateRange, setDateRange] = useState<{ start: Date, end: Date }>({
    start: new Date(),
    end: new Date()
  });
  
  const [displayDates, setDisplayDates] = useState<Date[]>([]);
  
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
    }
    
    // Add padding days
    start = addDays(start, -3);
    end = addDays(end, 3);
    
    setDateRange({ start, end });
  }, [viewMode, currentDate]);

  // Generate display dates
  useEffect(() => {
    const { start, end } = dateRange;
    const dates = eachDayOfInterval({ start, end });
    setDisplayDates(dates);
  }, [dateRange]);

  // Get color based on task status
  const getTaskColor = (task: GanttTask) => {
    if (task.type === 'task') {
      return 'bg-blue-600';
    }
    
    switch (task.status) {
      case 'planning':
        return 'bg-blue-600';
      case 'design':
        return 'bg-purple-600';
      case 'development':
        return 'bg-amber-500';
      case 'testing':
        return 'bg-cyan-500';
      case 'completed':
        return 'bg-green-600';
      case 'onhold':
        return 'bg-gray-500';
      default:
        return 'bg-blue-600';
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

  // Convert English day names to Korean
  const getKoreanWeekday = (date: Date): string => {
    const dayMap: Record<number, string> = {
      0: '일',
      1: '월',
      2: '화',
      3: '수',
      4: '목',
      5: '금',
      6: '토',
    };
    return dayMap[date.getDay()];
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center p-10 text-gray-500">
        표시할 작업이 없습니다
      </div>
    );
  }

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[600px] border-none"
    >
      {/* 작업 정보 패널 (Fixed) */}
      <ResizablePanel defaultSize={30} minSize={20} maxSize={40}>
        <div className="h-full">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-3 border-b text-left">업무명</th>
                <th className="p-3 border-b text-left w-24">담당자</th>
                <th className="p-3 border-b text-left w-24">상태</th>
                <th className="p-3 border-b text-left w-24">시작일</th>
                <th className="p-3 border-b text-left w-24">마감일</th>
              </tr>
            </thead>
          </table>
          <div className="h-[calc(100%-43px)] overflow-y-auto">
            <table className="w-full border-collapse">
              <tbody>
                {tasks.map((task) => (
                  <tr 
                    key={task.id} 
                    className="hover:bg-gray-50 border-b"
                  >
                    <td className="p-3 text-left">
                      <div className="flex items-center gap-1">
                        <Play className="h-4 w-4 text-gray-400" />
                        <span>{task.name}</span>
                      </div>
                    </td>
                    <td className="p-3 text-left text-sm">
                      {task.assignee || "-"}
                    </td>
                    <td className="p-3 text-left">
                      <span className={`px-2 py-1 rounded-full text-xs ${getTaskColor(task)} text-white`}>
                        {getStatusLabel(task.status)}
                      </span>
                    </td>
                    <td className="p-3 text-left text-sm">
                      {format(task.start, 'yy-MM-dd')}
                    </td>
                    <td className="p-3 text-left text-sm">
                      {format(task.end, 'yy-MM-dd')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ResizablePanel>

      {/* 리사이즈 핸들 */}
      <ResizableHandle withHandle className="bg-gray-200" />

      {/* 타임라인 패널 (Scrollable) */}
      <ResizablePanel defaultSize={70}>
        <div className="h-full relative">
          <div className="sticky top-0 bg-gray-50 z-10">
            <ScrollArea orientation="horizontal" className="overflow-x-auto">
              <table className="border-collapse min-w-max">
                <thead>
                  <tr>
                    {displayDates.map((date, index) => (
                      <th 
                        key={index}
                        className={`p-3 border-b text-center w-16 ${
                          isToday(date) ? 'bg-blue-50' : 
                          date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-100' : ''
                        }`}
                      >
                        <div className="text-sm font-medium">{format(date, 'yy-MM-dd')}</div>
                        <div className="text-xs text-gray-500">{getKoreanWeekday(date)}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </ScrollArea>
          </div>
          
          <ScrollArea orientation="horizontal" className="h-[calc(100%-43px)]">
            <div className="min-w-max">
              <table className="border-collapse min-w-max">
                <tbody>
                  {tasks.map((task) => (
                    <tr 
                      key={task.id} 
                      className="border-b hover:bg-gray-50"
                    >
                      {displayDates.map((date, dateIndex) => {
                        const isInRange = date >= task.start && date <= task.end;
                        const isStart = isSameDay(date, task.start);
                        const isEnd = isSameDay(date, task.end);
                        
                        return (
                          <td 
                            key={dateIndex}
                            className={`p-0 border-r h-[41px] w-16 ${
                              isToday(date) ? 'bg-blue-50' : 
                              date.getDay() === 0 || date.getDay() === 6 ? 'bg-gray-100' : ''
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
                                  <span className="text-xs text-white px-2">
                                    {task.progress}%
                                  </span>
                                )}
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default SimpleGanttChart;
