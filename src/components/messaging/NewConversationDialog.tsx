
import React, { useState } from "react";
import { TeamMember, Team } from "@/types/task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";

interface NewConversationDialogProps {
  open: boolean;
  onClose: () => void;
  onStartConversation: (userId: string) => void;
  members: TeamMember[];
  teams: Team[];
  currentUserId: string;
}

const NewConversationDialog: React.FC<NewConversationDialogProps> = ({
  open,
  onClose,
  onStartConversation,
  members,
  teams,
  currentUserId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  
  // Filter out the current user from members
  const filteredMembers = members.filter(member => 
    member.id !== currentUserId && 
    (selectedTeam ? member.teamId === selectedTeam : true) &&
    (searchQuery 
      ? member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    )
  );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                prefix={<Search className="h-4 w-4 text-muted-foreground" />}
              />
            </div>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="justify-between"
                >
                  {selectedTeam
                    ? teams.find((team) => team.id === selectedTeam)?.name || "All Teams"
                    : "All Teams"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search team..." />
                  <CommandEmpty>No team found.</CommandEmpty>
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setSelectedTeam(null)}
                      className="flex items-center"
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${!selectedTeam ? "opacity-100" : "opacity-0"}`}
                      />
                      All Teams
                    </CommandItem>
                    {teams.map((team) => (
                      <CommandItem
                        key={team.id}
                        onSelect={() => setSelectedTeam(team.id)}
                        className="flex items-center"
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${selectedTeam === team.id ? "opacity-100" : "opacity-0"}`}
                        />
                        {team.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          
          <ScrollArea className="h-[300px]">
            {filteredMembers.length > 0 ? (
              <div className="space-y-1">
                {filteredMembers.map((member) => (
                  <Button
                    key={member.id}
                    variant="ghost"
                    className="w-full justify-start p-3"
                    onClick={() => onStartConversation(member.id)}
                  >
                    <div className="flex items-center w-full">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-left">{member.name}</p>
                        <p className="text-sm text-muted-foreground text-left truncate">
                          {member.email}
                        </p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {teams.find(team => team.id === member.teamId)?.name}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
                <p>No members found</p>
                <p className="text-sm">Try adjusting your search or team filter</p>
              </div>
            )}
          </ScrollArea>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewConversationDialog;
