
import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskColumn from "@/components/TaskColumn";
import TaskForm from "@/components/TaskForm";
import { Task, TaskStatus, Team, TeamMember } from "@/types/task";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface TaskBoardProps {
  tasks: Task[];
  team: Team;
  teamTasks: Task[];
  members: TeamMember[];
  onCreateTask: (task: Omit<Task, "id" | "createdAt">) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddComment?: (taskId: string, content: string) => void;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ 
  tasks,
  team,
  teamTasks,
  members,
  onCreateTask, 
  onUpdateTask, 
  onDeleteTask, 
  onAddComment 
}) => {
  const [isCreatingTask, setIsCreatingTask] = useState(false);

  const todoTasks = tasks.filter(task => task.status === "todo");
  const inProgressTasks = tasks.filter(task => task.status === "in-progress");
  const doneTasks = tasks.filter(task => task.status === "done");

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    onUpdateTask({ ...task, status: newStatus });
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Tasks</h2>
        <Button 
          onClick={() => setIsCreatingTask(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle size={16} />
          <span>Add Task</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskColumn 
          title="To Do" 
          tasks={todoTasks}
          team={team}
          teamTasks={teamTasks}
          members={members}
          status="todo"
          onStatusChange={handleStatusChange}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onAddComment={onAddComment}
        />
        <TaskColumn 
          title="In Progress" 
          tasks={inProgressTasks}
          team={team}
          teamTasks={teamTasks}
          members={members}
          status="in-progress"
          onStatusChange={handleStatusChange}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onAddComment={onAddComment}
        />
        <TaskColumn 
          title="Done" 
          tasks={doneTasks}
          team={team}
          teamTasks={teamTasks}
          members={members}
          status="done"
          onStatusChange={handleStatusChange}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
          onAddComment={onAddComment}
        />
      </div>

      <Dialog open={isCreatingTask} onOpenChange={setIsCreatingTask}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm 
            onSubmit={(taskData) => {
              onCreateTask({
                ...taskData,
                title: taskData.title || '',
                status: taskData.status || 'todo',
              });
              setIsCreatingTask(false);
            }}
            onCancel={() => setIsCreatingTask(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskBoard;
