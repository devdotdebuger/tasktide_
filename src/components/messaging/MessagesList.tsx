
import React, { useRef, useEffect } from "react";
import { Message, TeamMember } from "@/types/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { Paperclip, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface MessagesListProps {
  messages: Message[];
  members: TeamMember[];
  currentUserId: string;
}

const MessagesList: React.FC<MessagesListProps> = ({
  messages,
  members,
  currentUserId,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom when new messages are added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach(message => {
    const date = new Date(message.createdAt).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  // Find member by ID
  const getMember = (id: string) => {
    return members.find(member => member.id === id);
  };

  return (
    <ScrollArea className="flex-1 p-4">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date} className="mb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
              {formatDate(date)}
            </div>
          </div>
          
          {dateMessages.map(message => {
            const isSender = message.senderId === currentUserId;
            const member = getMember(message.senderId);
            
            return (
              <div 
                key={message.id} 
                className={`flex mb-4 ${isSender ? "justify-end" : "justify-start"}`}
              >
                {!isSender && (
                  <Avatar className="h-8 w-8 mr-2 mt-1">
                    <AvatarImage src={member?.avatar} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {member?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[70%] ${isSender ? "items-end" : "items-start"}`}>
                  {!isSender && (
                    <div className="text-sm text-muted-foreground mb-1 ml-1">
                      {member?.name}
                    </div>
                  )}
                  
                  <div 
                    className={`rounded-lg p-3 ${
                      isSender 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.attachments.map(attachment => (
                          <Card key={attachment.id} className="p-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Paperclip size={16} className="text-muted-foreground" />
                              <div>
                                <div className="text-sm font-medium truncate max-w-[150px]">
                                  {attachment.fileName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {(attachment.fileSize / 1024).toFixed(1)} KB
                                </div>
                              </div>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0"
                              onClick={() => window.open(attachment.url, "_blank")}
                            >
                              <Download size={14} />
                            </Button>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className={`text-xs text-muted-foreground mt-1 ${isSender ? "text-right" : "text-left"}`}>
                    {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isSender && message.read && <span className="ml-1">✓</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      <div ref={bottomRef} />
    </ScrollArea>
  );
};

export default MessagesList;
