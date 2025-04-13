
import React, { useState } from "react";
import { CopyCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskTemplate, Team } from "@/types/task";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TaskTemplatesProps {
  templates: TaskTemplate[];
  team: Team;
  onUseTemplate: (template: TaskTemplate) => void;
  onCreateTemplate: (template: Partial<TaskTemplate>) => void;
}

const TaskTemplates: React.FC<TaskTemplatesProps> = ({
  templates,
  team,
  onUseTemplate,
  onCreateTemplate,
}) => {
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<TaskTemplate>>({
    name: "",
    description: "",
    teamId: team.id,
    fields: {
      title: "",
      description: ""
    }
  });

  const handleCreateTemplate = () => {
    if (newTemplate.name && newTemplate.fields) {
      onCreateTemplate(newTemplate);
      setNewTemplate({
        name: "",
        description: "",
        teamId: team.id,
        fields: {
          title: "",
          description: ""
        }
      });
      setIsCreatingTemplate(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Task Templates</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setIsCreatingTemplate(true)}
          className="flex items-center gap-1"
        >
          <Plus size={14} />
          <span>New Template</span>
        </Button>
      </div>

      {templates.length > 0 ? (
        <ScrollArea className="h-[200px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-1">
            {templates.map(template => (
              <div 
                key={template.id} 
                className="bg-card border rounded-md p-3 hover:border-primary transition-colors"
              >
                <h4 className="font-medium text-sm mb-1">{template.name}</h4>
                {template.description && (
                  <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => onUseTemplate(template)}
                >
                  <CopyCheck size={14} className="mr-1" />
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 border border-dashed border-muted-foreground/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">No templates yet</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsCreatingTemplate(true)}
          >
            Create Template
          </Button>
        </div>
      )}

      <Dialog open={isCreatingTemplate} onOpenChange={setIsCreatingTemplate}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Task Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="templateName" className="text-sm font-medium">
                Template Name
              </label>
              <Input 
                id="templateName" 
                placeholder="Bug Report"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="templateDescription" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea 
                id="templateDescription" 
                placeholder="Template for bug reports"
                value={newTemplate.description || ""}
                onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="defaultTitle" className="text-sm font-medium">
                Default Title (Optional)
              </label>
              <Input 
                id="defaultTitle" 
                placeholder="Bug: "
                value={newTemplate.fields?.title || ""}
                onChange={(e) => setNewTemplate({
                  ...newTemplate, 
                  fields: {...newTemplate.fields, title: e.target.value}
                })}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="defaultDescription" className="text-sm font-medium">
                Default Description (Optional)
              </label>
              <Textarea 
                id="defaultDescription" 
                placeholder="## Steps to Reproduce\n1.\n2.\n\n## Expected Behavior\n\n## Actual Behavior"
                value={newTemplate.fields?.description || ""}
                onChange={(e) => setNewTemplate({
                  ...newTemplate, 
                  fields: {...newTemplate.fields, description: e.target.value}
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsCreatingTemplate(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleCreateTemplate}
              disabled={!newTemplate.name}
            >
              Create Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskTemplates;
