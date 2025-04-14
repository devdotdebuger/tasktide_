import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskBoard from "@/components/TaskBoard";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import TeamManagement from "@/components/TeamManagement";
import TaskList from "@/components/TaskList";
import ConnectWithMember from "@/components/messaging/ConnectWithMember";
import { 
  Task, 
  Comment, 
  TeamMember, 
  Team, 
  Message, 
  Conversation, 
  Attachment,
  UserProfile
} from "@/types/task";
import { toast } from "@/components/ui/use-toast";
import ProfilePopover from "@/components/profile/ProfilePopover";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "current-user",
    name: "You",
    email: "you@example.com",
    avatar: "/lovable-uploads/avatars/default-avatar.png"
  });

  const [teams, setTeams] = useState<Team[]>([
    {
      id: "team1",
      name: "Main Team",
      description: "The main project team",
      createdAt: new Date().toISOString(),
      ownerId: "current-user",
    },
    {
      id: "team2",
      name: "Design Team",
      description: "UI/UX design team",
      createdAt: new Date().toISOString(),
      ownerId: "current-user",
    }
  ]);

  const [activeTeamId, setActiveTeamId] = useState<string>("team1");
  
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: "1", 
      title: "Design TaskTide UI mockups", 
      description: "Create wireframes and high-fidelity mockups for the application.", 
      status: "todo", 
      assignee: "Alex",
      priority: "high",
      deadline: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
      comments: [
        {
          id: "comment1",
          taskId: "1",
          author: "Taylor",
          content: "I think we should use a dark theme for the UI.",
          createdAt: new Date().toISOString(),
        }
      ],
      createdAt: new Date().toISOString(),
      teamId: "team1",
    },
    { 
      id: "2", 
      title: "Implement authentication flow", 
      description: "Add login, signup, and password reset functionality using Supabase Auth.", 
      status: "in-progress",
      assignee: "Sam",
      priority: "medium",
      createdAt: new Date().toISOString(),
      teamId: "team1",
    },
    { 
      id: "3", 
      title: "Create kanban board UI", 
      description: "Build the draggable kanban board interface for task management.", 
      status: "done",
      assignee: "Taylor",
      priority: "low",
      deadline: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      createdAt: new Date().toISOString(),
      teamId: "team1",
    },
    { 
      id: "4", 
      title: "Design system components", 
      description: "Create a cohesive design system for the application.", 
      status: "todo", 
      assignee: "Alex",
      priority: "high",
      createdAt: new Date().toISOString(),
      teamId: "team2",
    },
  ]);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "current-user",
      name: "You",
      email: "you@example.com",
      role: "admin",
      status: "active",
      joinedAt: new Date().toISOString(),
      teamId: "team1",
    },
    {
      id: "member1",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "member",
      status: "active",
      joinedAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
      teamId: "team1",
    },
    {
      id: "member2",
      name: "Sam Taylor",
      email: "sam@example.com",
      role: "member",
      status: "active",
      joinedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
      teamId: "team1",
    },
    {
      id: "current-user-team2",
      name: "You",
      email: "you@example.com",
      role: "admin",
      status: "active",
      joinedAt: new Date().toISOString(),
      teamId: "team2",
    },
    {
      id: "member3",
      name: "Morgan Lee",
      email: "morgan@example.com",
      role: "member",
      status: "active",
      joinedAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      teamId: "team2",
    },
  ]);

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "conv1",
      participants: ["current-user", "member1"],
      lastMessageAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      unreadCount: 2,
    },
    {
      id: "conv2",
      participants: ["current-user", "member2"],
      lastMessageAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      unreadCount: 0,
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg1",
      senderId: "member1",
      receiverId: "current-user",
      content: "Hi there! Could you review the new designs when you get a chance?",
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      read: false,
    },
    {
      id: "msg2",
      senderId: "member1",
      receiverId: "current-user",
      content: "I've attached the latest mockups for your feedback.",
      attachments: [
        {
          id: "att1",
          fileName: "homepage-design-v2.png",
          fileType: "image/png",
          fileSize: 2048000, // 2MB
          url: "https://source.unsplash.com/random/800x600/?design",
          uploadedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        }
      ],
      createdAt: new Date(Date.now() - 86400000 + 300000).toISOString(), // 1 day ago + 5 minutes
      read: false,
    },
    {
      id: "msg3",
      senderId: "current-user",
      receiverId: "member2",
      content: "Hey Sam, how's the authentication implementation going?",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      read: true,
    },
    {
      id: "msg4",
      senderId: "member2",
      receiverId: "current-user",
      content: "It's going well! I should be done by tomorrow. Need to finalize the error handling.",
      createdAt: new Date(Date.now() - 86400000 * 3 + 600000).toISOString(), // 3 days ago + 10 minutes
      read: true,
    }
  ]);

  const handleLogin = (email: string, password: string) => {
    console.log("Login with:", email, password);
    setIsAuthenticated(true);
    toast({
      title: "Logged in successfully",
      description: `Welcome back!`,
    });
  };

  const handleUpdateProfile = (updatedProfile: Partial<UserProfile>) => {
    setCurrentUser({
      ...currentUser,
      ...updatedProfile
    });
    
    toast({
      title: "Profile updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleCreateTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      comments: [],
      teamId: activeTeamId,
    };
    setTasks([...tasks, newTask]);
    toast({
      title: "Task created",
      description: `"${task.title}" has been added.`,
    });
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
    toast({
      title: "Task updated",
      description: `"${updatedTask.title}" has been updated.`,
    });
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: "The task has been removed.",
    });
  };

  const handleAddComment = (taskId: string, content: string) => {
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      taskId,
      author: "You",
      content,
      createdAt: new Date().toISOString(),
    };
    
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          comments: [...(task.comments || []), newComment]
        };
      }
      return task;
    }));
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the task.",
    });
  };

  const handleInviteMember = (email: string, role: TeamMember["role"]) => {
    const newMember: TeamMember = {
      id: Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0],
      email,
      role,
      status: "invited",
      joinedAt: new Date().toISOString(),
      teamId: activeTeamId,
    };
    
    setTeamMembers([...teamMembers, newMember]);
  };

  const handleUpdateMemberRole = (memberId: string, role: TeamMember["role"]) => {
    setTeamMembers(teamMembers.map(member => {
      if (member.id === memberId) {
        return { ...member, role };
      }
      return member;
    }));
    
    toast({
      title: "Role updated",
      description: `Team member role has been updated to ${role}.`,
    });
  };

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
    
    toast({
      title: "Member removed",
      description: "Team member has been removed from the team.",
    });
  };

  const handleCreateTeam = (teamName: string, description?: string) => {
    const newTeam: Team = {
      id: Math.random().toString(36).substring(2, 9),
      name: teamName,
      description,
      createdAt: new Date().toISOString(),
      ownerId: currentUser.id,
    };
    
    setTeams([...teams, newTeam]);
    
    const newMember: TeamMember = {
      id: `${currentUser.id}-${newTeam.id}`,
      name: currentUser.name,
      email: currentUser.email,
      role: "admin",
      status: "active",
      joinedAt: new Date().toISOString(),
      teamId: newTeam.id,
    };
    
    setTeamMembers([...teamMembers, newMember]);
    
    setActiveTeamId(newTeam.id);
    
    toast({
      title: "Team created",
      description: `"${teamName}" has been created.`,
    });
  };

  const handleJoinTeam = (teamId: string) => {
    const isAlreadyMember = teamMembers.some(member => 
      member.teamId === teamId && member.id.includes(currentUser.id)
    );
    
    if (!isAlreadyMember) {
      const newMember: TeamMember = {
        id: `${currentUser.id}-${teamId}`,
        name: currentUser.name,
        email: currentUser.email,
        role: "member",
        status: "active",
        joinedAt: new Date().toISOString(),
        teamId: teamId,
      };
      
      setTeamMembers([...teamMembers, newMember]);
      
      toast({
        title: "Team joined",
        description: `You have joined the team.`,
      });
    } else {
      toast({
        title: "Already a member",
        description: `You are already a member of this team.`,
      });
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    const team = teams.find(t => t.id === teamId);
    
    if (team && team.ownerId === currentUser.id) {
      setTeams(teams.filter(t => t.id !== teamId));
      setTeamMembers(teamMembers.filter(member => member.teamId !== teamId));
      setTasks(tasks.filter(task => task.teamId !== teamId));
      
      if (activeTeamId === teamId) {
        const firstTeam = teams.find(t => t.id !== teamId);
        if (firstTeam) {
          setActiveTeamId(firstTeam.id);
        }
      }
      
      toast({
        title: "Team deleted",
        description: `"${team.name}" has been deleted.`,
      });
    } else {
      toast({
        title: "Cannot delete team",
        description: "You need to be the team owner to delete it.",
        variant: "destructive",
      });
    }
  };

  const handleNewConversation = (participantId: string) => {
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(participantId) && 
      conv.participants.includes(currentUser.id)
    );
    
    if (existingConversation) {
      return existingConversation;
    }
    
    const newConversation: Conversation = {
      id: Math.random().toString(36).substring(2, 9),
      participants: [currentUser.id, participantId],
      lastMessageAt: new Date().toISOString(),
      unreadCount: 0,
    };
    
    setConversations([...conversations, newConversation]);
    
    return newConversation;
  };
  
  const handleSendMessage = (conversationId: string, content: string, attachments: Attachment[]) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    
    if (!conversation) return;
    
    const receiverId = conversation.participants.find(id => id !== currentUser.id);
    
    if (!receiverId) return;
    
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: currentUser.id,
      receiverId,
      content,
      attachments: attachments.length > 0 ? [...attachments] : undefined,
      createdAt: new Date().toISOString(),
      read: false,
    };
    
    setMessages([...messages, newMessage]);
    
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          lastMessageAt: new Date().toISOString(),
        };
      }
      return conv;
    }));
    
    if (Math.random() > 0.5) {
      setTimeout(() => {
        const replyMessage: Message = {
          id: Math.random().toString(36).substring(2, 9),
          senderId: receiverId,
          receiverId: currentUser.id,
          content: getRandomReply(),
          createdAt: new Date().toISOString(),
          read: false,
        };
        
        setMessages(prev => [...prev, replyMessage]);
        
        setConversations(prev => 
          prev.map(conv => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                lastMessageAt: new Date().toISOString(),
                unreadCount: conv.unreadCount + 1,
              };
            }
            return conv;
          })
        );
        
        toast({
          title: "New message",
          description: `${teamMembers.find(m => m.id === receiverId)?.name} replied to your message`,
        });
      }, 2000);
    }
  };
  
  const handleMarkAsRead = (conversationId: string) => {
    setConversations(conversations.map(conv => {
      if (conv.id === conversationId) {
        return {
          ...conv,
          unreadCount: 0,
        };
      }
      return conv;
    }));
    
    setMessages(messages.map(msg => {
      const otherParticipantId = conversations
        .find(conv => conv.id === conversationId)
        ?.participants.find(id => id !== currentUser.id);
        
      if (msg.senderId === otherParticipantId && msg.receiverId === currentUser.id && !msg.read) {
        return {
          ...msg,
          read: true,
        };
      }
      return msg;
    }));
  };
  
  const getRandomReply = () => {
    const replies = [
      "Thanks for the update!",
      "Got it, I'll take a look.",
      "Sounds good to me.",
      "Let me know if you need anything else.",
      "Perfect! Thanks for your help.",
      "I'll get back to you on that soon.",
      "That works for me.",
      "Great progress!",
    ];
    
    return replies[Math.floor(Math.random() * replies.length)];
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-700/20 via-amber-500/20 to-stone-900/40 relative overflow-hidden">
        {/* Background image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-100"
          style={{ 
            backgroundImage: `url('/lovable-uploads/39d5772c-6be3-4516-afe1-2cbd9de23b69.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Login form container */}
        <div className="w-full max-w-md z-10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-2xl bg-white bg-opacity-10 border border-white/20">
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  const activeTeamTasks = tasks.filter(task => task.teamId === activeTeamId);
  const activeTeamMembers = teamMembers.filter(member => member.teamId === activeTeamId);
  const activeTeam = teams.find(team => team.id === activeTeamId);
  const allMembers = teamMembers.filter(member => member.id !== currentUser.id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLogout={() => setIsAuthenticated(false)} 
        teams={teams}
        activeTeamId={activeTeamId}
        onTeamChange={setActiveTeamId}
        onCreateTeam={handleCreateTeam}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
      />
      <main className="flex-1 container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">{activeTeam?.name || "Team"}</h1>
          <p className="text-muted-foreground">{activeTeam?.description}</p>
        </div>

        <Tabs defaultValue="board" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
            <TabsTrigger value="connect">Connect</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="w-full">
            <TaskBoard 
              tasks={activeTeamTasks} 
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onAddComment={handleAddComment}
            />
          </TabsContent>

          <TabsContent value="list">
            {activeTeam && (
              <TaskList 
                tasks={activeTeamTasks} 
                team={activeTeam}
                members={activeTeamMembers}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
          </TabsContent>

          <TabsContent value="team" className="w-full">
            <TeamManagement
              members={activeTeamMembers}
              teams={teams}
              activeTeamId={activeTeamId}
              onInviteMember={handleInviteMember}
              onUpdateMemberRole={handleUpdateMemberRole}
              onRemoveMember={handleRemoveMember}
              onJoinTeam={handleJoinTeam}
              onDeleteTeam={handleDeleteTeam}
              currentUserId={currentUser.id}
            />
          </TabsContent>
          
          <TabsContent value="connect" className="w-full">
            <ConnectWithMember
              currentUserId={currentUser.id}
              teams={teams}
              members={allMembers}
              conversations={conversations}
              messages={messages}
              onNewConversation={handleNewConversation}
              onSendMessage={handleSendMessage}
              onMarkAsRead={handleMarkAsRead}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
