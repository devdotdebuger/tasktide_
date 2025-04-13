
import React, { useState } from "react";
import { Bell, LogOut, Menu, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Team } from "@/types/task";
import ThemeToggle from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onLogout: () => void;
  teams: Team[];
  activeTeamId: string;
  onTeamChange: (teamId: string) => void;
  onCreateTeam: (name: string, description?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onLogout, 
  teams, 
  activeTeamId, 
  onTeamChange,
  onCreateTeam
}) => {
  const [isCreateTeamDialogOpen, setIsCreateTeamDialogOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  const activeTeam = teams.find(team => team.id === activeTeamId);

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return;
    
    onCreateTeam(newTeamName, newTeamDescription);
    setNewTeamName("");
    setNewTeamDescription("");
    setIsCreateTeamDialogOpen(false);
  };

  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
          <h1 className="text-xl font-bold text-primary">TaskTide</h1>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1">
                {activeTeam?.name || "Select Team"}
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {teams.map(team => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => onTeamChange(team.id)}
                  className={activeTeamId === team.id ? "bg-accent/50" : ""}
                >
                  {team.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsCreateTeamDialogOpen(true)}>
                <Plus size={16} className="mr-2" />
                Create New Team
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <Bell size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut size={18} />
          </Button>
        </div>
      </div>
      
      <Dialog open={isCreateTeamDialogOpen} onOpenChange={setIsCreateTeamDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create a New Team</DialogTitle>
            <DialogDescription>
              Create a new team to collaborate with your colleagues.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="teamName" className="text-sm font-medium">
                Team Name
              </label>
              <Input 
                id="teamName" 
                placeholder="Marketing Team" 
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="teamDescription" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Input 
                id="teamDescription" 
                placeholder="Team responsible for marketing campaigns" 
                value={newTeamDescription}
                onChange={(e) => setNewTeamDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsCreateTeamDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleCreateTeam}
              disabled={!newTeamName.trim()}
            >
              Create Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Header;
