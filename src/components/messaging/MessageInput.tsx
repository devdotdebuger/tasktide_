
import React, { useState, useRef } from "react";
import { Attachment } from "@/types/task";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface MessageInputProps {
  onSendMessage: (content: string, attachments: Attachment[]) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message, attachments);
      setMessage("");
      setAttachments([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Attachment[] = [];
    
    Array.from(files).forEach(file => {
      // For demo purposes, create a data URL for the file
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const attachment: Attachment = {
            id: Math.random().toString(36).substring(2, 9),
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            url: event.target.result.toString(),
            uploadedAt: new Date().toISOString()
          };
          
          newAttachments.push(attachment);
          setAttachments(prev => [...prev, attachment]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    
    toast({
      title: "Files attached",
      description: `${files.length} file(s) ready to send`
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(attachment => attachment.id !== id));
  };

  return (
    <div className="border-t p-4 dark:border-gray-800">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map(attachment => (
            <div 
              key={attachment.id} 
              className="bg-muted rounded-lg p-2 flex items-center gap-2 max-w-[180px]"
            >
              <Paperclip size={14} className="flex-shrink-0" />
              <span className="text-sm truncate flex-1">{attachment.fileName}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 rounded-full"
                onClick={() => removeAttachment(attachment.id)}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-9 w-9"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip size={18} />
          <input
            type="file"
            multiple
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </Button>
        
        <Textarea
          placeholder="Type a message..."
          className="flex-1 min-h-10 max-h-32"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        
        <Button 
          variant="default" 
          size="icon" 
          className="rounded-full h-9 w-9"
          onClick={handleSendMessage}
          disabled={!message.trim() && attachments.length === 0}
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
