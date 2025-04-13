
import React from "react";
import TaskCard from "@/components/TaskCard";
import { Task, TaskStatus } from "@/types/task";

interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddComment?: (taskId: string, content: string) => void;
}

const StatusColors = {
  "todo": "bg-blue-500/20 text-blue-500",
  "in-progress": "bg-amber-500/20 text-amber-500",
  "done": "bg-green-500/20 text-green-500",
};

const StatusLabels = {
  "todo": "To Do",
  "in-progress": "In Progress",
  "done": "Done",
};

const TaskColumn: React.FC<TaskColumnProps> = ({ 
  title, 
  status, 
  tasks, 
  onStatusChange,
  onUpdateTask,
  onDeleteTask,
  onAddComment
}) => {
  return (
    <div className="kanban-column">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-medium">{title}</h3>
        <div className={`text-xs px-2 py-1 rounded-full ${StatusColors[status]}`}>
          {tasks.length}
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 border border-dashed border-muted-foreground/30 rounded-lg">
            <p className="text-sm text-muted-foreground">No tasks yet</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onStatusChange={onStatusChange}
              onUpdate={onUpdateTask}
              onDelete={onDeleteTask}
              onAddComment={onAddComment}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
