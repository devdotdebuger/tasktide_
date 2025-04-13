
import React from "react";
import { Bell, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="w-full border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
          <h1 className="text-xl font-bold text-primary">TaskTide</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
