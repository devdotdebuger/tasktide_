
import React, { useState } from "react";
import { Comment } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";

interface TaskCommentsProps {
  comments: Comment[];
  taskId: string;
  onAddComment: (taskId: string, content: string) => void;
}

const TaskComments: React.FC<TaskCommentsProps> = ({ comments, taskId, onAddComment }) => {
  const [newComment, setNewComment] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(taskId, newComment);
      setNewComment("");
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Comments</h4>
      
      {comments && comments.length > 0 ? (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="p-3 bg-muted/50 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="bg-primary/10 p-1 rounded-full">
                  <User size={12} />
                </div>
                <span className="text-xs font-medium">{comment.author}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>
              <p className="text-sm">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">No comments yet</p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-2">
        <Textarea 
          placeholder="Add a comment..." 
          className="resize-none text-sm"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={2}
        />
        <Button type="submit" size="sm" disabled={!newComment.trim()}>
          Add Comment
        </Button>
      </form>
    </div>
  );
};

export default TaskComments;
