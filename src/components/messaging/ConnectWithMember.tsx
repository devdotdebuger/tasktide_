
import React, { useState } from "react";
import { Team, TeamMember, Message, Conversation, Attachment } from "@/types/task";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ConversationList from "./ConversationList";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import NewConversationDialog from "./NewConversationDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface ConnectWithMemberProps {
  currentUserId: string;
  teams: Team[];
  members: TeamMember[];
  conversations: Conversation[];
  messages: Message[];
  onNewConversation: (participantId: string) => Conversation;
  onSendMessage: (conversationId: string, content: string, attachments: Attachment[]) => void;
  onMarkAsRead: (conversationId: string) => void;
}

const ConnectWithMember: React.FC<ConnectWithMemberProps> = ({
  currentUserId,
  teams,
  members,
  conversations,
  messages,
  onNewConversation,
  onSendMessage,
  onMarkAsRead,
}) => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showNewConversationDialog, setShowNewConversationDialog] = useState(false);
  
  // Currently selected conversation messages
  const conversationMessages = selectedConversation 
    ? messages.filter(msg => 
        selectedConversation.participants.includes(msg.senderId) && 
        selectedConversation.participants.includes(msg.receiverId)
      )
    : [];
    
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    onMarkAsRead(conversation.id);
  };
  
  const handleSendMessage = (content: string, attachments: Attachment[]) => {
    if (!selectedConversation) return;
    
    onSendMessage(selectedConversation.id, content, attachments);
    
    if (attachments.length > 0) {
      toast({
        title: "Message sent",
        description: `Message with ${attachments.length} attachment(s) sent successfully`,
      });
    }
  };
  
  const handleStartNewConversation = (participantId: string) => {
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(participantId) && 
      conv.participants.includes(currentUserId)
    );
    
    if (existingConversation) {
      setSelectedConversation(existingConversation);
      onMarkAsRead(existingConversation.id);
    } else {
      const newConversation = onNewConversation(participantId);
      setSelectedConversation(newConversation);
    }
    
    setShowNewConversationDialog(false);
  };
  
  // Get the other participant in the conversation
  const getOtherParticipant = () => {
    if (!selectedConversation) return null;
    
    const otherParticipantId = selectedConversation.participants.find(
      id => id !== currentUserId
    );
    
    return members.find(member => member.id === otherParticipantId);
  };
  
  const otherParticipant = getOtherParticipant();
  
  return (
    <div className="flex flex-col h-[600px] rounded-lg border">
      <Tabs defaultValue="connect" className="h-full flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="connect">Connect</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connect" className="flex-1 flex overflow-hidden">
          {!selectedConversation ? (
            <div className="w-full">
              <ConversationList
                conversations={conversations}
                members={members}
                currentUserId={currentUserId}
                onSelectConversation={handleSelectConversation}
                onNewConversation={() => setShowNewConversationDialog(true)}
              />
            </div>
          ) : (
            <>
              <div className="w-full flex flex-col">
                <div className="border-b p-3 flex items-center gap-3 dark:border-gray-800">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ArrowLeft size={16} />
                  </Button>
                  
                  {otherParticipant && (
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={otherParticipant.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {otherParticipant.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{otherParticipant.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {teams.find(team => team.id === otherParticipant.teamId)?.name}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <MessagesList
                  messages={conversationMessages}
                  members={members}
                  currentUserId={currentUserId}
                />
                
                <MessageInput onSendMessage={handleSendMessage} />
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="dashboard" className="flex-1 p-4">
          <div className="text-center h-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-semibold mb-2">Messaging Dashboard</h2>
            <p className="text-muted-foreground mb-6">
              Connect with team members across all your teams
            </p>
            <div className="grid gap-4 grid-cols-2 max-w-md w-full">
              <Button 
                variant="outline" 
                onClick={() => setShowNewConversationDialog(true)}
                className="h-24 flex flex-col"
              >
                <span className="text-lg mb-1">New Message</span>
                <span className="text-xs text-muted-foreground">Start a conversation</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedConversation(
                  conversations.length > 0 ? conversations[0] : null
                )}
                className="h-24 flex flex-col"
                disabled={conversations.length === 0}
              >
                <span className="text-lg mb-1">Inbox</span>
                <span className="text-xs text-muted-foreground">
                  {conversations.length} conversation(s)
                </span>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      <NewConversationDialog
        open={showNewConversationDialog}
        onClose={() => setShowNewConversationDialog(false)}
        onStartConversation={handleStartNewConversation}
        members={members}
        teams={teams}
        currentUserId={currentUserId}
      />
    </div>
  );
};

export default ConnectWithMember;
