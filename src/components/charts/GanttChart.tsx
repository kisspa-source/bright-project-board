
import React, { useEffect, useRef, useState } from 'react';
import { GanttTask } from '@/types';
import { format } from 'date-fns';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

interface GanttChartProps {
  tasks: GanttTask[];
  onTaskClick?: (task: GanttTask) => void;
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks, onTaskClick }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [daysArray, setDaysArray] = useState<Date[]>([]);

  // Calculate start and end dates from tasks
  useEffect(() => {
    if (tasks.length === 0) return;

    // Find earliest start date and latest end date
    const start = new Date(Math.min(...tasks.map(t => t.start.getTime())));
    const end = new Date(Math.max(...tasks.map(t => t.end.getTime())));

    // Add buffer days
    start.setDate(start.getDate() - 5);
    end.setDate(end.getDate() + 5);

    setStartDate(start);
    setEndDate(end);
  }, [tasks]);

  // Generate array of days between start and end
  useEffect(() => {
    const days: Date[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDaysArray(days);
  }, [startDate, endDate]);

  // Get day width based on chart container width
  const getDayWidth = () => {
    if (!chartRef.current) return 40;
    return Math.max(40, chartRef.current.offsetWidth / daysArray.length);
  };

  // Get color based on task progress
  const getTaskColor = (task: GanttTask) => {
    if (task.type === 'task') {
      return 'bg-pms-accent';
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
        return 'bg-pms-primary';
    }
  };

  // Calculate position and width of task bar
  const getTaskBarStyle = (task: GanttTask) => {
    const dayWidth = getDayWidth();
    
    // Calculate days from start date to task start
    const taskStart = task.start.getTime();
    const chartStart = startDate.getTime();
    const daysFromStart = Math.floor((taskStart - chartStart) / (1000 * 60 * 60 * 24));
    
    // Calculate task duration in days
    const taskDuration = Math.ceil((task.end.getTime() - task.start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return {
      left: `${daysFromStart * dayWidth}px`,
      width: `${taskDuration * dayWidth}px`,
    };
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
        No tasks to display
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="min-h-[300px]">
      {/* Left panel (Task names) - Resizable */}
      <ResizablePanel defaultSize={30} minSize={20} maxSize={50}>
        <div className="w-full h-full flex flex-col">
          <div className="px-4 py-2 font-medium border-r border-b">
            Task
          </div>
          <div className="overflow-y-auto flex-1">
            {tasks.map((task) => (
              <div key={task.id} className="border-b hover:bg-gray-50">
                <div className="px-4 py-3 border-r">
                  <div className="font-medium">{task.name}</div>
                  {task.type !== 'task' && (
                    <div className="text-xs text-gray-500">
                      {format(task.start, 'yy-MM-dd')} ~ {format(task.end, 'yy-MM-dd')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </ResizablePanel>
      
      {/* Resize handle */}
      <ResizableHandle withHandle />
      
      {/* Right panel (Timeline) - Resizable */}
      <ResizablePanel defaultSize={70}>
        <div className="w-full h-full flex flex-col">
          {/* Date headers - Scrollable horizontally */}
          <div className="flex overflow-x-auto border-b">
            {daysArray.map((day, index) => (
              <div 
                key={index} 
                className={`px-2 py-2 text-center text-xs font-medium flex-shrink-0 ${
                  day.getDay() === 0 || day.getDay() === 6 
                    ? 'bg-gray-100' 
                    : ''
                }`}
                style={{ width: `${getDayWidth()}px`, minWidth: '40px' }}
              >
                <div className="whitespace-nowrap">{format(day, 'yy-MM-dd')}</div>
                <div className="text-gray-500">{getKoreanWeekday(day)}</div>
              </div>
            ))}
          </div>
          
          {/* Task timeline - Scrollable both horizontally and vertically */}
          <div className="overflow-y-auto flex-1" ref={chartRef}>
            <div className="relative overflow-x-auto" style={{ minWidth: `${daysArray.length * 40}px` }}>
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex border-b hover:bg-gray-50"
                >
                  <div className="relative" style={{ height: '50px', width: '100%' }}>
                    {/* Task bar */}
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 rounded-md h-6 ${getTaskColor(task)}`}
                      style={getTaskBarStyle(task)}
                      onClick={() => onTaskClick && onTaskClick(task)}
                    >
                      <div className="px-2 text-xs text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis h-full flex items-center">
                        {task.progress < 100 ? `${task.progress}%` : '✓'}
                      </div>
                    </div>
                    
                    {/* Task dependencies */}
                    {task.dependencies && task.dependencies.split(',').map(dependency => {
                      const dependentTask = tasks.find(t => t.id === dependency.trim());
                      if (!dependentTask) return null;
                      
                      return (
                        <div 
                          key={`${task.id}-${dependency}`} 
                          className="absolute top-1/2 h-0.5 bg-gray-300"
                          style={{
                            left: `${getTaskBarStyle(dependentTask).left}`,
                            width: `${
                              parseInt(getTaskBarStyle(task).left) - 
                              parseInt(getTaskBarStyle(dependentTask).left)
                            }px`,
                            transform: 'translateY(-50%)'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default GanttChart;
