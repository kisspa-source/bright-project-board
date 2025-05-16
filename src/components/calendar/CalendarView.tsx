
import React from "react";
import { GanttTask } from "@/types";
import { format, eachDayOfInterval, isSameDay } from "date-fns";
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfQuarter, 
  endOfQuarter 
} from "date-fns";

interface CalendarViewProps {
  tasks: GanttTask[];
  viewMode: "day" | "week" | "month" | "quarter";
  currentDate: Date;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, viewMode, currentDate }) => {
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

  // Filter tasks based on the current date range
  const filterTasksByDateRange = () => {
    const { start, end } = getDateRange();
    
    return tasks.filter(task => {
      const taskStart = new Date(task.start);
      const taskEnd = new Date(task.end);
      
      // Task overlaps with the current date range
      return (
        (taskStart <= end && taskStart >= start) || // Task starts in the range
        (taskEnd >= start && taskEnd <= end) || // Task ends in the range
        (taskStart <= start && taskEnd >= end) // Task spans the entire range
      );
    });
  };

  // Generate array of days in the current view
  const generateDaysArray = () => {
    const { start, end } = getDateRange();
    return eachDayOfInterval({ start, end });
  };

  // Format the header text based on view mode
  const getHeaderText = (day: Date) => {
    if (viewMode === 'day') {
      return format(day, 'yyyy-MM-dd');
    } else if (viewMode === 'week' || viewMode === 'month') {
      return format(day, 'MM/dd');
    } else {
      return format(day, 'MM/dd');
    }
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const days = generateDaysArray();
  const filteredTasks = filterTasksByDateRange();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="text-xs">
            <th className="bg-gray-50 p-2 border text-left w-64">프로젝트명</th>
            <th className="bg-gray-50 p-2 border text-left w-28">담당자</th>
            <th className="bg-gray-50 p-2 border text-left w-16">상태</th>
            <th className="bg-gray-50 p-2 border text-left w-24">시작일</th>
            <th className="bg-gray-50 p-2 border text-left w-24">마감일</th>
            {days.map((day, idx) => (
              <th 
                key={idx} 
                className={`p-2 border text-center w-12 ${
                  isWeekend(day) ? 'bg-gray-100' : 
                  isToday(day) ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div>{format(day, 'dd')}</div>
                <div className="text-gray-500">{format(day, 'E')}</div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50">
              <td className="p-2 border">
                {task.name}
              </td>
              <td className="p-2 border">
                {task.project ? "Project" : "Task"}
              </td>
              <td className="p-2 border">
                <span className={`inline-block px-2 py-1 rounded-full text-xs text-white ${getTaskColor(task)}`}>
                  {task.status || "task"}
                </span>
              </td>
              <td className="p-2 border text-xs">
                {format(task.start, 'yyyy-MM-dd')}
              </td>
              <td className="p-2 border text-xs">
                {format(task.end, 'yyyy-MM-dd')}
              </td>
              {days.map((day, idx) => {
                const isTaskActive = (
                  day >= task.start && 
                  day <= task.end
                );
                
                const isTaskStart = isSameDay(day, task.start);
                const isTaskEnd = isSameDay(day, task.end);
                
                return (
                  <td 
                    key={idx} 
                    className={`p-0 border text-center ${
                      isWeekend(day) ? 'bg-gray-100' : ''
                    }`}
                  >
                    {isTaskActive && (
                      <div 
                        className={`h-6 ${getTaskColor(task)} ${
                          isTaskStart ? 'rounded-l-md ml-0' : 'ml-0'
                        } ${
                          isTaskEnd ? 'rounded-r-md mr-0' : 'mr-0'
                        }`}
                      >
                        {isTaskStart && <span className="text-xs text-white">●</span>}
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
  );
};

export default CalendarView;
