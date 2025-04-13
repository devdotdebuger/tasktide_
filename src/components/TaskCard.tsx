
import React, { useState } from "react";
import { MoreVertical, Edit2, Trash2, User, Calendar, MessageSquare, Flag } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus, TaskPriority } from "@/types/task";
import TaskForm from "@/components/TaskForm";
import TaskComments from "@/components/TaskComments";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface TaskCardProps {
  task: Task;
  onStatusChange: (task: Task, newStatus: TaskStatus) => void;
  onUpdate: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onAddComment?: (taskId: string, content: string) => void;
}

const priorityColors = {
  "low": "bg-blue-500/20 text-blue-500",
  "medium": "bg-amber-500/20 text-amber-500",
  "high": "bg-red-500/20 text-red-500"
};

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onUpdate, onDelete, onAddComment }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showComments, setShowComments] = useState(false);
  
  const handleStatusChange = (newStatus: TaskStatus) => {
    onStatusChange(task, newStatus);
  };

  const handleAddComment = (taskId: string, content: string) => {
    if (onAddComment) {
      onAddComment(taskId, content);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
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
              
              <DropdownMenuItem onClick={() => setShowComments(true)}>
                <MessageSquare size={14} className="mr-2" />
                Comments
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
        
        <div className="flex flex-wrap gap-2 mt-3">
          {task.priority && (
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${priorityColors[task.priority]}`}>
              <Flag size={10} />
              <span>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
            </div>
          )}
          
          {task.deadline && (
            <HoverCard>
              <HoverCardTrigger asChild>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full text-xs cursor-pointer">
                  <Calendar size={10} />
                  <span>{formatDate(task.deadline)}</span>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-50">
                <p className="text-xs">Due date: {new Date(task.deadline).toLocaleString()}</p>
              </HoverCardContent>
            </HoverCard>
          )}
          
          {task.assignee && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full text-xs">
              <User size={10} />
              <span>{task.assignee}</span>
            </div>
          )}
          
          {task.comments && task.comments.length > 0 && (
            <div 
              className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-full text-xs cursor-pointer"
              onClick={() => setShowComments(true)}
            >
              <MessageSquare size={10} />
              <span>{task.comments.length}</span>
            </div>
          )}
        </div>
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
      
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task Comments</DialogTitle>
          </DialogHeader>
          <TaskComments 
            comments={task.comments || []}
            taskId={task.id}
            onAddComment={handleAddComment}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskCard;
