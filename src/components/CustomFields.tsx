
import React, { useState } from "react";
import { Settings, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Team, Task } from "@/types/task";

interface CustomFieldsProps {
  team: Team;
  task?: Task;
  onAddCustomField: (field: { name: string, type: string }) => void;
  onUpdateCustomFieldValue: (fieldName: string, value: string | number | boolean) => void;
}

const CustomFields: React.FC<CustomFieldsProps> = ({
  team,
  task,
  onAddCustomField,
  onUpdateCustomFieldValue,
}) => {
  const [isAddingField, setIsAddingField] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "date" | "boolean" | "select">("text");

  const handleAddField = () => {
    if (newFieldName.trim()) {
      onAddCustomField({
        name: newFieldName.trim(),
        type: newFieldType,
      });
      setNewFieldName("");
      setNewFieldType("text");
      setIsAddingField(false);
    }
  };

  const renderCustomFieldInput = (fieldName: string, fieldType: string, currentValue: any) => {
    switch (fieldType) {
      case "text":
        return (
          <Input
            value={currentValue || ""}
            onChange={(e) => onUpdateCustomFieldValue(fieldName, e.target.value)}
            className="text-sm"
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={currentValue || ""}
            onChange={(e) => onUpdateCustomFieldValue(fieldName, Number(e.target.value))}
            className="text-sm"
          />
        );
      case "date":
        return (
          <Input
            type="date"
            value={currentValue || ""}
            onChange={(e) => onUpdateCustomFieldValue(fieldName, e.target.value)}
            className="text-sm"
          />
        );
      case "boolean":
        return (
          <Switch
            checked={!!currentValue}
            onCheckedChange={(checked) => onUpdateCustomFieldValue(fieldName, checked)}
          />
        );
      case "select":
        const options = team.customFields?.find(f => f.name === fieldName)?.options || [];
        return (
          <Select
            value={currentValue || ""}
            onValueChange={(value) => onUpdateCustomFieldValue(fieldName, value)}
          >
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      default:
        return <Input />;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-1">
          <Settings size={14} />
          <span>Custom Fields</span>
        </h4>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2"
          onClick={() => setIsAddingField(true)}
        >
          <Plus size={14} />
          <span className="ml-1">Add Field</span>
        </Button>
      </div>

      {team.customFields && team.customFields.length > 0 ? (
        <div className="space-y-3">
          {team.customFields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label htmlFor={field.id} className="text-xs font-medium">
                {field.name}
              </label>
              {renderCustomFieldInput(
                field.name,
                field.type,
                task?.customFields?.[field.name]
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No custom fields yet</p>
      )}

      <Dialog open={isAddingField} onOpenChange={setIsAddingField}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Custom Field</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fieldName">Field Name</Label>
              <Input
                id="fieldName"
                placeholder="e.g., Story Points"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fieldType">Field Type</Label>
              <Select value={newFieldType} onValueChange={(value) => setNewFieldType(value as any)}>
                <SelectTrigger id="fieldType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="boolean">Yes/No</SelectItem>
                  <SelectItem value="select">Select</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddingField(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleAddField}
              disabled={!newFieldName.trim()}
            >
              Add Field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomFields;
