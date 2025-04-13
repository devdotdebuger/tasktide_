
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Task, TaskStatus, TaskPriority, Analytics, TeamMember, Team } from "@/types/task";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours}h`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

export function formatDate(dateString: string, includeTime = false) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid date";
  
  const formattedDate = date.toLocaleDateString();
  
  if (includeTime) {
    return `${formattedDate} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  return formattedDate;
}

export function calculateTimeFromNow(dateString: string) {
  const now = new Date();
  const date = new Date(dateString);
  
  const diffInMs = date.getTime() - now.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} from now`;
    }
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} from now`;
  }
  
  if (diffInDays < 0) {
    const absDiffInDays = Math.abs(diffInDays);
    return `${absDiffInDays} day${absDiffInDays !== 1 ? 's' : ''} ago`;
  }
  
  return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} from now`;
}

export function generateAnalytics(tasks: Task[], members: TeamMember[], team: Team): Analytics {
  // Count tasks by status
  const tasksByStatus = {
    todo: 0,
    "in-progress": 0,
    done: 0
  };
  
  // Count tasks by priority
  const tasksByPriority: {[key in TaskPriority]?: number} = {
    low: 0,
    medium: 0,
    high: 0
  };
  
  // Track task completion by member
  const memberCompletions: {[memberId: string]: {completed: number, times: number[]}} = {};
  
  // Process all tasks
  tasks.forEach(task => {
    // Count by status
    tasksByStatus[task.status]++;
    
    // Count by priority if available
    if (task.priority) {
      tasksByPriority[task.priority] = (tasksByPriority[task.priority] || 0) + 1;
    }
    
    // Track completion data
    if (task.status === "done" && task.assignee) {
      const member = members.find(m => m.name === task.assignee);
      if (member) {
        if (!memberCompletions[member.id]) {
          memberCompletions[member.id] = { completed: 0, times: [] };
        }
        
        memberCompletions[member.id].completed++;
        
        // If we have creation and completion dates, calculate time
        if (task.createdAt) {
          const creationDate = new Date(task.createdAt).getTime();
          const completionDate = new Date().getTime(); // Assume now if not specified
          const completionTime = (completionDate - creationDate) / (1000 * 60 * 60 * 24); // in days
          memberCompletions[member.id].times.push(completionTime);
        }
      }
    }
  });
  
  // Calculate total completed tasks
  const tasksCompleted = tasksByStatus.done;
  
  // Calculate completion rate
  const completionRate = tasks.length > 0 
    ? Math.round((tasksCompleted / tasks.length) * 100) 
    : 0;
  
  // Calculate average completion time across all tasks
  let totalCompletionTime = 0;
  let completedTasksWithTime = 0;
  
  Object.values(memberCompletions).forEach(data => {
    data.times.forEach(time => {
      totalCompletionTime += time;
      completedTasksWithTime++;
    });
  });
  
  const averageCompletionTime = completedTasksWithTime > 0 
    ? totalCompletionTime / completedTasksWithTime 
    : 0;
  
  // Calculate member performance metrics
  const memberPerformance = Object.entries(memberCompletions).map(([memberId, data]) => {
    const avgTime = data.times.length > 0 
      ? data.times.reduce((sum, time) => sum + time, 0) / data.times.length 
      : 0;
    
    return {
      memberId,
      tasksCompleted: data.completed,
      averageCompletionTime: avgTime
    };
  });
  
  return {
    tasksCompleted,
    tasksCreated: tasks.length,
    averageCompletionTime,
    completionRate,
    tasksByStatus,
    tasksByPriority,
    memberPerformance
  };
}

export function hasDependencyCycle(tasks: Task[], taskId: string, dependencyId: string): boolean {
  // Check if adding this dependency would create a cycle
  const visited = new Set<string>();
  const recStack = new Set<string>();
  
  // If we're checking if adding dependencyId as a dependency to taskId would create a cycle,
  // we need to temporarily add this relationship
  const tempDependencyMap = new Map<string, string[]>();
  
  // Build the dependency graph
  tasks.forEach(task => {
    tempDependencyMap.set(task.id, [...(task.dependencies || [])]);
  });
  
  // Add the proposed dependency
  const taskDependencies = tempDependencyMap.get(taskId) || [];
  tempDependencyMap.set(taskId, [...taskDependencies, dependencyId]);
  
  // DFS to check for cycles
  const isCyclic = (nodeId: string): boolean => {
    if (!visited.has(nodeId)) {
      visited.add(nodeId);
      recStack.add(nodeId);
      
      const dependencies = tempDependencyMap.get(nodeId) || [];
      for (const depId of dependencies) {
        if (!visited.has(depId) && isCyclic(depId)) {
          return true;
        } else if (recStack.has(depId)) {
          return true;
        }
      }
    }
    
    recStack.delete(nodeId);
    return false;
  };
  
  return isCyclic(taskId);
}
