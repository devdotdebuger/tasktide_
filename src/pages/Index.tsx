
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskBoard from "@/components/TaskBoard";
import Header from "@/components/Header";
import LoginForm from "@/components/LoginForm";
import { Task } from "@/types/task";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: "1", 
      title: "Design TaskTide UI mockups", 
      description: "Create wireframes and high-fidelity mockups for the application.", 
      status: "todo", 
      assignee: "Alex",
      createdAt: new Date().toISOString(),
    },
    { 
      id: "2", 
      title: "Implement authentication flow", 
      description: "Add login, signup, and password reset functionality using Supabase Auth.", 
      status: "in-progress",
      assignee: "Sam",
      createdAt: new Date().toISOString(),
    },
    { 
      id: "3", 
      title: "Create kanban board UI", 
      description: "Build the draggable kanban board interface for task management.", 
      status: "done",
      assignee: "Taylor",
      createdAt: new Date().toISOString(), 
    },
  ]);

  const handleLogin = (email: string, password: string) => {
    console.log("Login with:", email, password);
    setIsAuthenticated(true);
  };

  const handleCreateTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
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
          </TabsList>

          <TabsContent value="board" className="w-full">
            <TaskBoard 
              tasks={tasks} 
              onCreateTask={handleCreateTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
            />
          </TabsContent>

          <TabsContent value="list">
            <div className="animate-fade-in">
              <p className="text-muted-foreground">List view coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
