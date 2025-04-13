import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskBoard from "@/components/TaskBoard";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import TeamManagement from "@/components/TeamManagement";
import { Task, Comment, TeamMember, Team } from "@/types/task";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "current-user",
    name: "You",
    email: "you@example.com",
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

  const activeTeamTasks = tasks.filter(task => task.teamId === activeTeamId);
  const activeTeamMembers = teamMembers.filter(member => member.teamId === activeTeamId);
  const activeTeam = teams.find(team => team.id === activeTeamId);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header 
        onLogout={() => setIsAuthenticated(false)} 
        teams={teams}
        activeTeamId={activeTeamId}
        onTeamChange={setActiveTeamId}
        onCreateTeam={handleCreateTeam}
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
            <div className="animate-fade-in">
              <p className="text-muted-foreground">List view coming soon</p>
            </div>
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
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
