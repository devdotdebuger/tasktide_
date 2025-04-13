
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { TeamMember, Team } from "@/types/task";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, Mail, MoreVertical, UserPlus, Shield, Eye, Plus, Users, Trash } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

interface TeamManagementProps {
  members: TeamMember[];
  teams: Team[];
  activeTeamId: string;
  onInviteMember: (email: string, role: TeamMember["role"]) => void;
  onUpdateMemberRole: (memberId: string, role: TeamMember["role"]) => void;
  onRemoveMember: (memberId: string) => void;
  onJoinTeam: (teamId: string) => void;
  onDeleteTeam: (teamId: string) => void;
  currentUserId: string;
}

const roleIcons = {
  "admin": <Shield className="h-4 w-4 mr-2" />,
  "member": <UserPlus className="h-4 w-4 mr-2" />,
  "viewer": <Eye className="h-4 w-4 mr-2" />
};

const roleLabels = {
  "admin": "Admin",
  "member": "Member",
  "viewer": "Viewer"
};

const roleBadgeColors = {
  "admin": "bg-blue-500/20 text-blue-500",
  "member": "bg-green-500/20 text-green-500",
  "viewer": "bg-amber-500/20 text-amber-500"
};

const TeamManagement: React.FC<TeamManagementProps> = ({
  members,
  teams,
  activeTeamId,
  onInviteMember,
  onUpdateMemberRole,
  onRemoveMember,
  onJoinTeam,
  onDeleteTeam,
  currentUserId
}) => {
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<TeamMember["role"]>("member");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"members" | "all-teams">("members");

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    
    onInviteMember(inviteEmail, inviteRole);
    setInviteEmail("");
    setInviteRole("member");
    setIsInviteDialogOpen(false);
    
    toast({
      title: "Invitation sent",
      description: `An invitation has been sent to ${inviteEmail}`,
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const isUserInTeam = (teamId: string) => {
    return members.some(member => 
      member.teamId === teamId && 
      member.id.includes(currentUserId)
    );
  };

  const activeTeam = teams.find(team => team.id === activeTeamId);
  const isCurrentUserTeamOwner = activeTeam?.ownerId === currentUserId;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-4">
          <Button 
            variant={activeTab === "members" ? "default" : "outline"}
            onClick={() => setActiveTab("members")}
          >
            <Users className="h-4 w-4 mr-2" />
            Team Members
          </Button>
          <Button 
            variant={activeTab === "all-teams" ? "default" : "outline"}
            onClick={() => setActiveTab("all-teams")}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Join Teams
          </Button>
        </div>
        
        {activeTab === "members" && (
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      {activeTab === "members" && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search members..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length > 0 ? (
                  filteredMembers.map(member => (
                    <TableRow key={member.id}>
                      <TableCell className="flex items-center gap-3">
                        <Avatar>
                          {member.avatar ? (
                            <AvatarImage src={member.avatar} alt={member.name} />
                          ) : (
                            <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${roleBadgeColors[member.role]}`}>
                          {roleIcons[member.role]}
                          {roleLabels[member.role]}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={member.status === "active" ? "default" : "outline"}>
                          {member.status === "active" ? "Active" : "Invited"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {!member.id.includes(currentUserId) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onUpdateMemberRole(member.id, "admin")}>
                                Make Admin
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onUpdateMemberRole(member.id, "member")}>
                                Make Member
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onUpdateMemberRole(member.id, "viewer")}>
                                Make Viewer
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => onRemoveMember(member.id)}
                              >
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No team members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {isCurrentUserTeamOwner && (
            <div className="flex justify-end">
              <Button 
                variant="destructive" 
                onClick={() => onDeleteTeam(activeTeamId)}
                className="flex items-center gap-2"
              >
                <Trash size={16} />
                Delete Team
              </Button>
            </div>
          )}
        </>
      )}

      {activeTab === "all-teams" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map(team => (
            <Card key={team.id} className={activeTeamId === team.id ? "border-primary" : ""}>
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>
                  {team.description || "No description available"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Created on {new Date(team.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Badge>
                  {members.filter(m => m.teamId === team.id).length} members
                </Badge>
                {isUserInTeam(team.id) ? (
                  <Button variant="outline" disabled>
                    Already a member
                  </Button>
                ) : (
                  <Button onClick={() => onJoinTeam(team.id)}>
                    Join Team
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to add a new member to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input 
                id="email" 
                placeholder="colleague@example.com" 
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={inviteRole === "admin" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setInviteRole("admin")}
                >
                  {roleIcons.admin}
                  Admin
                </Button>
                <Button 
                  type="button" 
                  variant={inviteRole === "member" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setInviteRole("member")}
                >
                  {roleIcons.member}
                  Member
                </Button>
                <Button 
                  type="button" 
                  variant={inviteRole === "viewer" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setInviteRole("viewer")}
                >
                  {roleIcons.viewer}
                  Viewer
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleInvite}
              disabled={!inviteEmail.trim()}
            >
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamManagement;
