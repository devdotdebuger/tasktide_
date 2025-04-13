
import React, { useState } from "react";
import { MoreVertical, Edit2, Trash2, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus } from "@/types/task";
import TaskForm from "@/components/TaskForm";

interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange(task, newStatus);
  };

  return (
    <>
      <div className="task-card bg-card p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-sm">{task.title}</h4>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit2 size={14} className="mr-2" />
                Edit
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {task.status !== "todo" && (
                <DropdownMenuItem onClick={() => handleStatusChange("todo")}>
                  Move to To Do
                </DropdownMenuItem>
              )}
              
              {task.status !== "in-progress" && (
                <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                  Move to In Progress
                </DropdownMenuItem>
              )}
              
              {task.status !== "done" && (
                <DropdownMenuItem onClick={() => handleStatusChange("done")}>
                  Move to Done
                </DropdownMenuItem>
              )}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(task.id)}
              >
                <Trash2 size={14} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {task.description && (
          <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
        )}
        
        {task.assignee && (
          <div className="flex items-center mt-3">
            <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full text-xs">
              <User size={12} />
              <span>{task.assignee}</span>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            task={task}
            onSubmit={(taskData) => {
              onUpdate({ ...task, ...taskData });
              setIsEditing(false);
            }}
            onCancel={() => setIsEditing(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
