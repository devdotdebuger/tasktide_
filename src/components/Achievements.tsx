
import React from "react";
import { Achievement, TeamMember } from "@/types/task";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Award, Trophy, Clock, CheckCircle2, Star, Zap, BarChart } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface AchievementsProps {
  member: TeamMember;
}

const getAchievementIcon = (achievement: Achievement) => {
  switch (achievement.icon) {
    case "award": return <Award className="h-4 w-4 text-amber-500" />;
    case "trophy": return <Trophy className="h-4 w-4 text-amber-500" />;
    case "clock": return <Clock className="h-4 w-4 text-blue-500" />;
    case "checkCircle": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "star": return <Star className="h-4 w-4 text-purple-500" />;
    case "zap": return <Zap className="h-4 w-4 text-red-500" />;
    case "chart": return <BarChart className="h-4 w-4 text-indigo-500" />;
    default: return <Award className="h-4 w-4 text-amber-500" />;
  }
};

const Achievements: React.FC<AchievementsProps> = ({ member }) => {
  if (!member.achievements || member.achievements.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No achievements yet.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-2">
        {member.achievements.map((achievement) => (
          <HoverCard key={achievement.id}>
            <HoverCardTrigger asChild>
              <div className="bg-card border rounded-lg p-3 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-colors">
                <div className="p-2 bg-muted rounded-full">
                  {getAchievementIcon(achievement)}
                </div>
                <div className="text-center">
                  <h3 className="font-medium text-sm">{achievement.name}</h3>
                </div>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-semibold">{achievement.name}</h4>
                <p className="text-sm">{achievement.description}</p>
                <p className="text-xs text-muted-foreground">
                  Earned on {formatDate(achievement.earnedAt, true)}
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </ScrollArea>
  );
};

export default Achievements;
