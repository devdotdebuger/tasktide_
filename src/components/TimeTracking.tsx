
import React, { useState } from "react";
import { Clock, Play, Pause, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDuration } from "@/lib/utils";

interface TimeTrackingProps {
  estimated?: number;
  logged?: number;
  onLogTime?: (minutes: number) => void;
  onUpdateEstimate?: (minutes: number) => void;
}

const TimeTracking: React.FC<TimeTrackingProps> = ({ 
  estimated, 
  logged = 0, 
  onLogTime, 
  onUpdateEstimate 
}) => {
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [manualTime, setManualTime] = useState("");

  const startTracking = () => {
    if (isTracking) return;
    
    const now = Date.now();
    setStartTime(now);
    setIsTracking(true);
    
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - now) / 1000));
    }, 1000);
    
    setTimerInterval(interval as unknown as NodeJS.Timeout);
  };

  const stopTracking = () => {
    if (!isTracking) return;
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    const timeSpent = Math.floor(elapsedTime / 60); // Convert to minutes
    
    if (onLogTime && timeSpent > 0) {
      onLogTime(timeSpent);
    }
    
    setIsTracking(false);
    setStartTime(null);
    setElapsedTime(0);
    setTimerInterval(null);
  };

  const handleManualTimeSubmit = () => {
    const minutes = parseInt(manualTime);
    if (!isNaN(minutes) && minutes > 0 && onLogTime) {
      onLogTime(minutes);
      setManualTime("");
    }
  };

  return (
    <div className="space-y-3 p-3 bg-muted/30 rounded-md">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium flex items-center gap-1">
          <Clock size={14} />
          <span>Time Tracking</span>
        </h4>
        
        <div className="flex items-center gap-1">
          {isTracking ? (
            <Button variant="outline" size="sm" onClick={stopTracking} className="h-7 px-2">
              <Pause size={14} className="mr-1" />
              Stop
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={startTracking} className="h-7 px-2">
              <Play size={14} className="mr-1" />
              Start
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="text-xs">
          <span className="text-muted-foreground">Estimated: </span>
          <span className="font-medium">{estimated ? formatDuration(estimated) : "Not set"}</span>
        </div>
        
        <div className="text-xs">
          <span className="text-muted-foreground">Logged: </span>
          <span className="font-medium">{formatDuration(logged)}</span>
        </div>
      </div>
      
      {isTracking && (
        <div className="text-sm font-medium text-center py-1 bg-accent/50 rounded">
          {formatDuration(Math.floor(elapsedTime / 60))}
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <Input 
          type="number" 
          placeholder="Log time (min)" 
          className="h-8 text-xs"
          value={manualTime}
          onChange={(e) => setManualTime(e.target.value)}
        />
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 px-2"
          onClick={handleManualTimeSubmit}
          disabled={!manualTime}
        >
          <Save size={14} />
        </Button>
      </div>
    </div>
  );
};

export default TimeTracking;
