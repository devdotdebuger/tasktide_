
import React, { useState } from "react";
import { UserProfile } from "@/types/task";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Check, 
  LogOut, 
  User, 
  Lock, 
  AtSign, 
  Edit, 
  X
} from "lucide-react";
import ProfileAvatarSelect from "./ProfileAvatarSelect";

interface ProfilePopoverProps {
  currentUser: UserProfile;
  onUpdateProfile: (updatedProfile: Partial<UserProfile>) => void;
  onLogout: () => void;
}

const ProfilePopover: React.FC<ProfilePopoverProps> = ({
  currentUser,
  onUpdateProfile,
  onLogout
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(currentUser.name || "");
  const [email, setEmail] = useState(currentUser.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);

  const handleSaveProfile = () => {
    onUpdateProfile({
      name,
      email
    });
    setEditMode(false);
  };

  const handleSavePassword = () => {
    if (newPassword === confirmPassword) {
      // In a real application, you would validate the current password
      // and send a request to update the password
      console.log("Password updated");
      
      // Reset password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEditPasswordMode(false);
    }
  };

  const handleAvatarChange = (avatarUrl: string) => {
    onUpdateProfile({
      avatar: avatarUrl
    });
  };

  const cancelEdit = () => {
    setName(currentUser.name || "");
    setEmail(currentUser.email || "");
    setEditMode(false);
  };

  const cancelPasswordEdit = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setEditPasswordMode(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Profile Information</h3>
                {!editMode ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditMode(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={handleSaveProfile}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {!editMode ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{currentUser.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    <span>{currentUser.email}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <AtSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-6" 
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </Button>
          </TabsContent>
          
          <TabsContent value="avatar" className="p-4">
            <ProfileAvatarSelect
              currentAvatar={currentUser.avatar || ""}
              onSelectAvatar={handleAvatarChange}
            />
          </TabsContent>
          
          <TabsContent value="security" className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Change Password</h3>
                {!editPasswordMode ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditPasswordMode(true)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Change
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={cancelPasswordEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={handleSavePassword}
                      disabled={!currentPassword || !newPassword || newPassword !== confirmPassword}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              
              {editPasswordMode && (
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    {newPassword && confirmPassword && newPassword !== confirmPassword && (
                      <p className="text-destructive text-xs mt-1">Passwords do not match</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

export default ProfilePopover;
