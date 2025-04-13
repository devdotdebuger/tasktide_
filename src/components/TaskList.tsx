
import React, { useState } from "react";
import { Task, TeamMember, Team } from "@/types/task";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  ArrowUpDown, 
  ChevronDown, 
  Search, 
  Edit2, 
  Trash2,
  Flag,
  User,
  Calendar,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import TaskLabels from "@/components/TaskLabels";
import { formatDate } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TaskForm from "@/components/TaskForm";

interface TaskListProps {
  tasks: Task[];
  team: Team;
  members: TeamMember[];
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

type SortField = "title" | "status" | "priority" | "assignee" | "deadline";
type SortDirection = "asc" | "desc";

const priorityColors = {
  "low": "bg-blue-500/20 text-blue-500",
  "medium": "bg-amber-500/20 text-amber-500",
  "high": "bg-red-500/20 text-red-500"
};

const statusColors = {
  "todo": "bg-blue-500/20 text-blue-500",
  "in-progress": "bg-amber-500/20 text-amber-500",
  "done": "bg-green-500/20 text-green-500"
};

const TaskList: React.FC<TaskListProps> = ({ tasks, team, members, onUpdateTask, onDeleteTask }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  
  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.assignee && task.assignee.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    
    switch (sortField) {
      case "title":
        return a.title.localeCompare(b.title) * direction;
      case "status":
        return a.status.localeCompare(b.status) * direction;
      case "priority":
        if (!a.priority) return direction;
        if (!b.priority) return -direction;
        return a.priority.localeCompare(b.priority) * direction;
      case "assignee":
        if (!a.assignee) return direction;
        if (!b.assignee) return -direction;
        return a.assignee.localeCompare(b.assignee) * direction;
      case "deadline":
        if (!a.deadline) return direction;
        if (!b.deadline) return -direction;
        return (new Date(a.deadline).getTime() - new Date(b.deadline).getTime()) * direction;
      default:
        return 0;
    }
  });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search tasks..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[30%]">
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("title")}
                  className="flex items-center space-x-1 p-0 h-auto"
                >
                  <span>Title</span>
                  {sortField === "title" ? (
                    sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  ) : (
                    <ArrowUpDown size={14} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("status")}
                  className="flex items-center space-x-1 p-0 h-auto"
                >
                  <span>Status</span>
                  {sortField === "status" ? (
                    sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  ) : (
                    <ArrowUpDown size={14} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("priority")}
                  className="flex items-center space-x-1 p-0 h-auto"
                >
                  <span>Priority</span>
                  {sortField === "priority" ? (
                    sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  ) : (
                    <ArrowUpDown size={14} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("assignee")}
                  className="flex items-center space-x-1 p-0 h-auto"
                >
                  <span>Assignee</span>
                  {sortField === "assignee" ? (
                    sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  ) : (
                    <ArrowUpDown size={14} />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button 
                  variant="ghost" 
                  onClick={() => handleSort("deadline")}
                  className="flex items-center space-x-1 p-0 h-auto"
                >
                  <span>Deadline</span>
                  {sortField === "deadline" ? (
                    sortDirection === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />
                  ) : (
                    <ArrowUpDown size={14} />
                  )}
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTasks.length > 0 ? (
              sortedTasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <div>{task.title}</div>
                      <TaskLabels labels={task.labels} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={`px-2 py-1 rounded-full text-xs flex items-center justify-center w-fit ${statusColors[task.status]}`}>
                      {task.status === "todo" ? "To Do" : 
                       task.status === "in-progress" ? "In Progress" : "Done"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.priority && (
                      <div className={`px-2 py-1 rounded-full text-xs flex items-center justify-center w-fit ${priorityColors[task.priority]}`}>
                        <Flag size={10} className="mr-1" />
                        <span>{task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.assignee && (
                      <div className="flex items-center space-x-1">
                        <User size={14} />
                        <span>{task.assignee}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.deadline && (
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{formatDate(task.deadline)}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <ChevronDown size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingTask(task)}>
                          <Edit2 size={14} className="mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive" 
                          onClick={() => onDeleteTask(task.id)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                  No tasks found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm 
              task={editingTask}
              onSubmit={(taskData) => {
                onUpdateTask({ ...editingTask, ...taskData });
                setEditingTask(null);
              }}
              onCancel={() => setEditingTask(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TaskList;
