
import React from "react";
import { Conversation, TeamMember } from "@/types/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MessageCircle } from "lucide-react";

interface ConversationListProps {
  conversations: Conversation[];
  members: TeamMember[];
  currentUserId: string;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
  selectedConversationId?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  members,
  currentUserId,
  onSelectConversation,
  onNewConversation,
  selectedConversationId,
}) => {
  // Sort conversations by last message date (newest first)
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  // Get the other participant in a conversation (for 1:1 chats)
  const getOtherParticipant = (conversation: Conversation) => {
    const otherParticipantId = conversation.participants.find(id => id !== currentUserId);
    return members.find(member => member.id === otherParticipantId);
  };

  return (
    <div className="flex flex-col h-full border-r dark:border-gray-800">
      <div className="p-4 border-b dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Messages</h2>
          <Button 
            onClick={onNewConversation} 
            size="sm" 
            variant="outline"
            className="flex items-center gap-1"
          >
            <MessageCircle size={14} />
            <span>New</span>
          </Button>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        {sortedConversations.length > 0 ? (
          <div className="px-3">
            {sortedConversations.map(conversation => {
              const otherParticipant = getOtherParticipant(conversation);
              
              return (
                <Button
                  key={conversation.id}
                  variant="ghost"
                  className={`w-full justify-start p-3 mb-1 rounded-lg ${
                    selectedConversationId === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => onSelectConversation(conversation)}
                >
                  <div className="flex items-start w-full">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={otherParticipant?.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {otherParticipant?.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{otherParticipant?.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.lastMessageAt), { addSuffix: true })}
                        </span>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-sm text-muted-foreground truncate">
                            New messages
                          </span>
                          <Badge variant="default" className="rounded-full">
                            {conversation.unreadCount}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 p-4 text-center text-muted-foreground">
            <Users className="h-10 w-10 mb-2 opacity-20" />
            <p>No conversations yet</p>
            <p className="text-sm">Start messaging with your team members</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
