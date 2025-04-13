
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignee?: string;
  createdAt: string;
  priority?: TaskPriority;
  deadline?: string;
  comments?: Comment[];
  teamId?: string; // Add teamId to associate tasks with teams
}

export interface Comment {
  id: string;
  taskId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  ownerId: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member" | "viewer";
  status: "active" | "invited";
  joinedAt: string;
  teamId: string; // Add teamId to associate members with teams
}

export interface UserTeams {
  userId: string;
  teams: Team[];
}
