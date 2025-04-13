
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Team, Task, TeamMember, Analytics } from "@/types/task";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';

interface DashboardProps {
  team: Team;
  tasks: Task[];
  members: TeamMember[];
  analytics: Analytics;
}

const COLORS = ['#8884d8', '#F4CE14', '#06D6A0', '#EF476F'];

const Dashboard: React.FC<DashboardProps> = ({ team, tasks, members, analytics }) => {
  // Data for task status distribution
  const statusData = [
    { name: 'To Do', value: analytics.tasksByStatus.todo },
    { name: 'In Progress', value: analytics.tasksByStatus["in-progress"] },
    { name: 'Done', value: analytics.tasksByStatus.done }
  ];
  
  // Data for tasks by priority
  const priorityData = Object.entries(analytics.tasksByPriority).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value
  }));
  
  // Team members performance data
  const memberPerformanceData = analytics.memberPerformance.map(member => {
    const memberInfo = members.find(m => m.id === member.memberId);
    return {
      name: memberInfo?.name || 'Unknown',
      tasksCompleted: member.tasksCompleted,
      completionTime: member.averageCompletionTime
    };
  });

  // Weekly task completion data (mocked for demo)
  const weeklyCompletionData = [
    { name: 'Mon', completed: 5 },
    { name: 'Tue', completed: 7 },
    { name: 'Wed', completed: 10 },
    { name: 'Thu', completed: 8 },
    { name: 'Fri', completed: 12 },
    { name: 'Sat', completed: 3 },
    { name: 'Sun', completed: 2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Task Overview</CardTitle>
            <CardDescription>Statistics about your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{tasks.length}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Completed Tasks</p>
                <p className="text-2xl font-bold">{analytics.tasksCompleted}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{analytics.completionRate}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Avg Completion Time</p>
                <p className="text-2xl font-bold">{analytics.averageCompletionTime.toFixed(1)}d</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Task Status</CardTitle>
            <CardDescription>Distribution by status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Weekly Activity</CardTitle>
            <CardDescription>Tasks completed per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyCompletionData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="completed" 
                    stroke="#8884d8" 
                    strokeWidth={2} 
                    dot={{ fill: '#8884d8', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Team Performance</CardTitle>
          <CardDescription>Tasks completed by team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memberPerformanceData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasksCompleted" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
