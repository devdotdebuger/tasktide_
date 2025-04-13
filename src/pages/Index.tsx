
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskBoard from "@/components/TaskBoard";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import TeamManagement from "@/components/TeamManagement";
import { Task, Comment, TeamMember } from "@/types/task";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    },
    { 
      id: "2", 
      title: "Implement authentication flow", 
      description: "Add login, signup, and password reset functionality using Supabase Auth.", 
      status: "in-progress",
      assignee: "Sam",
      priority: "medium",
      createdAt: new Date().toISOString(),
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
    },
    {
      id: "member1",
      name: "Alex Johnson",
      email: "alex@example.com",
      role: "member",
      status: "active",
      joinedAt: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
    },
    {
      id: "member2",
      name: "Sam Taylor",
      email: "sam@example.com",
      role: "member",
      status: "active",
      joinedAt: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    },
  ]);

  const handleLogin = (email: string, password: string) => {
    console.log("Login with:", email, password);
    setIsAuthenticated(true);
    toast({
      title: "Logged in successfully",
      description: `Welcome back!`,
    });
  };

  const handleCreateTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      comments: [],
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
      author: "You", // In a real app, this would be the current user
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
    // In a real app, this would send an invitation email
    const newMember: TeamMember = {
      id: Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0], // Simple placeholder name from email
      email,
      role,
      status: "invited",
      joinedAt: new Date().toISOString(),
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">TaskTide</h1>
            <p className="text-muted-foreground">Minimal team task management</p>
          </div>
          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header onLogout={() => setIsAuthenticated(false)} />
      <main className="flex-1 container py-6">
        <Tabs defaultValue="board" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="team">Team</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="w-full">
            <TaskBoard 
              tasks={tasks} 
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onAddComment={handleAddComment}
            />
          </TabsContent>

          <TabsContent value="list">
            <div className="animate-fade-in">
              <p className="text-muted-foreground">List view coming soon</p>
            </div>
          </TabsContent>

          <TabsContent value="team" className="w-full">
            <TeamManagement
              members={teamMembers}
              onInviteMember={handleInviteMember}
              onUpdateMemberRole={handleUpdateMemberRole}
              onRemoveMember={handleRemoveMember}
              currentUserId="current-user"
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
