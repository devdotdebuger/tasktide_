
import React, { useState } from "react";
import { Link, X, Plus } from "lucide-react";
import { Task } from "@/types/task";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskDependenciesProps {
  task: Task;
  teamTasks: Task[];
  onAddDependency: (taskId: string, dependencyId: string) => void;
  onRemoveDependency: (taskId: string, dependencyId: string) => void;
}

const TaskDependencies: React.FC<TaskDependenciesProps> = ({
  task,
  teamTasks,
  onAddDependency,
  onRemoveDependency,
}) => {
  const [selectedDependency, setSelectedDependency] = useState<string>("");
  
  const dependencyTasks = teamTasks.filter(
    (t) => task.dependencies?.includes(t.id)
  );
  
  const availableTasks = teamTasks.filter(
    (t) => t.id !== task.id && !task.dependencies?.includes(t.id)
  );

  const handleAddDependency = () => {
    if (selectedDependency && onAddDependency) {
      onAddDependency(task.id, selectedDependency);
      setSelectedDependency("");
    }
  };

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium flex items-center gap-1">
        <Link size={14} />
        <span>Dependencies</span>
      </h4>

      {dependencyTasks.length > 0 ? (
        <ScrollArea className="h-[120px] rounded-md border">
          <div className="p-2 space-y-2">
            {dependencyTasks.map((dependencyTask) => (
              <div key={dependencyTask.id} className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                <span className="text-xs truncate mr-2">{dependencyTask.title}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => onRemoveDependency(task.id, dependencyTask.id)}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <p className="text-xs text-muted-foreground">No dependencies yet</p>
      )}

      <div className="flex items-center gap-2">
        <Select
          value={selectedDependency}
          onValueChange={setSelectedDependency}
        >
          <SelectTrigger className="w-full h-8 text-xs">
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            {availableTasks.length > 0 ? (
              availableTasks.map((t) => (
                <SelectItem key={t.id} value={t.id} className="text-xs">
                  {t.title}
                </SelectItem>
              ))
            ) : (
              <SelectItem value="none" disabled className="text-xs">
                No available tasks
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          className="h-8 px-2"
          onClick={handleAddDependency}
          disabled={!selectedDependency}
        >
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );
};

export default TaskDependencies;
