
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskPriority = "low" | "medium" | "high";
export type TaskLabel = "bug" | "feature" | "improvement" | "documentation" | "design" | "custom";

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
  teamId?: string;
  labels?: TaskLabel[];
  timeTracking?: {
    estimated?: number; // in minutes
    logged?: number; // in minutes
  };
  dependencies?: string[]; // Array of task IDs that this task depends on
  customFields?: {
    [key: string]: string | number | boolean;
  };
  templateId?: string;
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
  customFields?: { 
    id: string;
    name: string;
    type: "text" | "number" | "date" | "boolean" | "select";
    options?: string[]; // For select type
  }[];
  templates?: TaskTemplate[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "member" | "viewer";
  status: "active" | "invited";
  joinedAt: string;
  teamId: string;
  achievements?: Achievement[];
}

export interface UserTeams {
  userId: string;
  teams: Team[];
}

export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  teamId: string;
  fields: {
    title?: string;
    description?: string;
    priority?: TaskPriority;
    labels?: TaskLabel[];
    customFields?: {
      [key: string]: string | number | boolean;
    };
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface Analytics {
  tasksCompleted: number;
  tasksCreated: number;
  averageCompletionTime: number; // in days
  completionRate: number; // percentage
  tasksByStatus: {
    [key in TaskStatus]: number;
  };
  tasksByPriority: {
    [key in TaskPriority]?: number;
  };
  memberPerformance: {
    memberId: string;
    tasksCompleted: number;
    averageCompletionTime: number;
  }[];
}

// New messaging types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachments?: Attachment[];
  createdAt: string;
  read: boolean;
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number; // in bytes
  url: string; // This would be a data URL for our demo
  uploadedAt: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  lastMessageAt: string;
  unreadCount: number;
}
