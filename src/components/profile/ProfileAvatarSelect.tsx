
import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check } from "lucide-react";

interface ProfileAvatarSelectProps {
  currentAvatar: string;
  onSelectAvatar: (avatarUrl: string) => void;
}

const ProfileAvatarSelect: React.FC<ProfileAvatarSelectProps> = ({
  currentAvatar,
  onSelectAvatar
}) => {
  // Define avatar options by category
  const avatars = {
    marvel: [
      { name: "Iron Man", url: "/lovable-uploads/avatars/marvel-ironman.png" },
      { name: "Captain America", url: "/lovable-uploads/avatars/marvel-captain.png" },
      { name: "Thor", url: "/lovable-uploads/avatars/marvel-thor.png" },
      { name: "Black Widow", url: "/lovable-uploads/avatars/marvel-blackwidow.png" },
      { name: "Spider-Man", url: "/lovable-uploads/avatars/marvel-spiderman.png" },
    ],
    dc: [
      { name: "Batman", url: "/lovable-uploads/avatars/dc-batman.png" },
      { name: "Superman", url: "/lovable-uploads/avatars/dc-superman.png" },
      { name: "Wonder Woman", url: "/lovable-uploads/avatars/dc-wonderwoman.png" },
      { name: "Flash", url: "/lovable-uploads/avatars/dc-flash.png" },
      { name: "Aquaman", url: "/lovable-uploads/avatars/dc-aquaman.png" },
    ],
    anime: [
      { name: "Naruto", url: "/lovable-uploads/avatars/anime-naruto.png" },
      { name: "Goku", url: "/lovable-uploads/avatars/anime-goku.png" },
      { name: "Luffy", url: "/lovable-uploads/avatars/anime-luffy.png" },
      { name: "Sailor Moon", url: "/lovable-uploads/avatars/anime-sailormoon.png" },
      { name: "Totoro", url: "/lovable-uploads/avatars/anime-totoro.png" },
    ]
  };

  // For now, we'll use placeholder images since we don't have the actual avatar images
  const placeholderUrl = "https://api.dicebear.com/7.x/bottts/svg?seed=";

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Avatar</h3>
      <ScrollArea className="h-72">
        <div className="space-y-4">
          {/* Marvel Section */}
          <div>
            <h4 className="text-sm font-medium mb-2">Marvel</h4>
            <div className="grid grid-cols-3 gap-2">
              {avatars.marvel.map((avatar, index) => (
                <AvatarOption
                  key={`marvel-${index}`}
                  name={avatar.name}
                  // Use placeholder URL for now
                  url={`${placeholderUrl}${avatar.name.replace(/\s+/g, '')}`}
                  isSelected={currentAvatar === avatar.url}
                  onSelect={() => onSelectAvatar(avatar.url)}
                />
              ))}
            </div>
          </div>
          
          {/* DC Section */}
          <div>
            <h4 className="text-sm font-medium mb-2">DC</h4>
            <div className="grid grid-cols-3 gap-2">
              {avatars.dc.map((avatar, index) => (
                <AvatarOption
                  key={`dc-${index}`}
                  name={avatar.name}
                  // Use placeholder URL for now
                  url={`${placeholderUrl}${avatar.name.replace(/\s+/g, '')}`}
                  isSelected={currentAvatar === avatar.url}
                  onSelect={() => onSelectAvatar(avatar.url)}
                />
              ))}
            </div>
          </div>
          
          {/* Anime Section */}
          <div>
            <h4 className="text-sm font-medium mb-2">Anime</h4>
            <div className="grid grid-cols-3 gap-2">
              {avatars.anime.map((avatar, index) => (
                <AvatarOption
                  key={`anime-${index}`}
                  name={avatar.name}
                  // Use placeholder URL for now
                  url={`${placeholderUrl}${avatar.name.replace(/\s+/g, '')}`}
                  isSelected={currentAvatar === avatar.url}
                  onSelect={() => onSelectAvatar(avatar.url)}
                />
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

interface AvatarOptionProps {
  name: string;
  url: string;
  isSelected: boolean;
  onSelect: () => void;
}

const AvatarOption: React.FC<AvatarOptionProps> = ({
  name,
  url,
  isSelected,
  onSelect
}) => {
  return (
    <div 
      className={`flex flex-col items-center space-y-1 p-2 rounded-md cursor-pointer transition-colors ${
        isSelected ? 'bg-primary/10' : 'hover:bg-accent'
      }`}
      onClick={onSelect}
    >
      <div className="relative">
        <Avatar className="h-16 w-16">
          <AvatarImage src={url} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        {isSelected && (
          <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground rounded-full p-0.5">
            <Check className="h-3 w-3" />
          </div>
        )}
      </div>
      <span className="text-xs text-center leading-tight">{name}</span>
    </div>
  );
};

export default ProfileAvatarSelect;
