import React from 'react';
import * as Icons from 'lucide-react';
import { Achievement } from '@/data/achievements';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AchievementDetailsModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

const AchievementDetailsModal: React.FC<AchievementDetailsModalProps> = ({
  achievement,
  isOpen,
  onClose
}) => {
  if (!achievement) return null;

  // Get the correct icon from Lucide icons
  const IconComponent = achievement.icon in Icons 
    ? (Icons[achievement.icon as keyof typeof Icons] as React.ElementType) 
    : Icons.Award;
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-game-background border-game-secondary text-game-text">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-game-secondary">
            <div className="bg-game-secondary p-2 rounded-full">
              <IconComponent size={24} className="text-game-background" />
            </div>
            <span>{achievement.title}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <p className="text-game-text-muted mb-4">{achievement.description}</p>
          
          {achievement.progress !== undefined && achievement.maxProgress && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-game-text-muted">Progress</span>
                <span className="text-game-text-muted">
                  {achievement.progress}/{achievement.maxProgress}
                </span>
              </div>
              <div className="pixel-progress w-full h-2 bg-gray-800">
                <div 
                  style={{ 
                    width: `${(achievement.progress / achievement.maxProgress) * 100}%` 
                  }} 
                  className="bg-game-accent h-full"
                ></div>
              </div>
            </div>
          )}

          <div className="mt-6 text-sm text-game-text-muted">
            {achievement.unlocked ? (
              <p>Unlocked: {new Date(achievement.unlockedAt || '').toLocaleDateString()}</p>
            ) : (
              <p>Locked</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AchievementDetailsModal;
