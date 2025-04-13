
import React from "react";
import { Tag } from "lucide-react";
import { TaskLabel } from "@/types/task";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface TaskLabelsProps {
  labels?: TaskLabel[];
  onAddLabel?: (label: TaskLabel) => void;
  onRemoveLabel?: (label: TaskLabel) => void;
}

const labelColors = {
  "bug": "bg-red-500/20 text-red-500",
  "feature": "bg-green-500/20 text-green-500",
  "improvement": "bg-blue-500/20 text-blue-500",
  "documentation": "bg-purple-500/20 text-purple-500",
  "design": "bg-amber-500/20 text-amber-500",
  "custom": "bg-gray-500/20 text-gray-500",
};

const labelDescriptions = {
  "bug": "Something isn't working as expected",
  "feature": "New functionality",
  "improvement": "Enhancement to existing features",
  "documentation": "Documentation related tasks",
  "design": "UI/UX design tasks",
  "custom": "Custom label type"
};

const TaskLabels: React.FC<TaskLabelsProps> = ({ labels, onAddLabel, onRemoveLabel }) => {
  if (!labels || labels.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {labels.map((label) => (
        <HoverCard key={label}>
          <HoverCardTrigger asChild>
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs cursor-default ${labelColors[label]}`}>
              <Tag size={10} />
              <span className="capitalize">{label}</span>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="w-auto p-2">
            <p className="text-xs">{labelDescriptions[label]}</p>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  );
};

export default TaskLabels;
