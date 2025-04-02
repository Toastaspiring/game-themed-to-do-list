
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import AchievementBadge from './AchievementBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Achievement } from '@/data/achievements';

const AchievementList: React.FC = () => {
  const { achievements } = useTaskContext();
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  
  // Debug logging to see what we're actually getting
  useEffect(() => {
    console.log('Total achievements loaded:', achievements.length);
    console.log('Achievements by category:', {
      streak: achievements.filter(a => a.category === 'streak').length,
      completion: achievements.filter(a => a.category === 'completion').length,
      special: achievements.filter(a => a.category === 'special').length
    });
  }, [achievements]);
  
  // Filter achievements by category
  const streakAchievements = achievements.filter(a => a.category === 'streak');
  const completionAchievements = achievements.filter(a => a.category === 'completion');
  const specialAchievements = achievements.filter(a => a.category === 'special');
  
  // Apply unlocked/locked filter
  const filterAchievements = (achievementList: Achievement[]) => {
    if (filter === 'unlocked') return achievementList.filter(a => a.unlocked);
    if (filter === 'locked') return achievementList.filter(a => !a.unlocked);
    return achievementList;
  };
  
  return (
    <div className="mb-8 animate-pixel-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <h2 className="text-xl font-bold text-game-secondary">
          Achievements ({achievements.length} total)
        </h2>
        
        <div className="mt-2 sm:mt-0 flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded ${filter === 'all' ? 'bg-game-secondary text-game-background' : 'bg-gray-800 text-game-text-muted'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('unlocked')}
            className={`px-3 py-1 text-sm rounded ${filter === 'unlocked' ? 'bg-game-secondary text-game-background' : 'bg-gray-800 text-game-text-muted'}`}
          >
            Unlocked
          </button>
          <button 
            onClick={() => setFilter('locked')}
            className={`px-3 py-1 text-sm rounded ${filter === 'locked' ? 'bg-game-secondary text-game-background' : 'bg-gray-800 text-game-text-muted'}`}
          >
            Locked
          </button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid grid-cols-4 bg-game-background border border-gray-700 rounded-lg mb-4">
          <TabsTrigger value="all" className="data-[state=active]:bg-game-secondary data-[state=active]:text-game-background">All</TabsTrigger>
          <TabsTrigger value="streak" className="data-[state=active]:bg-game-secondary data-[state=active]:text-game-background">Streak</TabsTrigger>
          <TabsTrigger value="completion" className="data-[state=active]:bg-game-secondary data-[state=active]:text-game-background">Completion</TabsTrigger>
          <TabsTrigger value="special" className="data-[state=active]:bg-game-secondary data-[state=active]:text-game-background">Special</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {filterAchievements(achievements).map((achievement, index) => (
              <div 
                key={achievement.id} 
                className="transform transition-all hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AchievementBadge achievement={achievement} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="streak" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {filterAchievements(streakAchievements).map((achievement, index) => (
              <div 
                key={achievement.id} 
                className="transform transition-all hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AchievementBadge achievement={achievement} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="completion" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {filterAchievements(completionAchievements).map((achievement, index) => (
              <div 
                key={achievement.id} 
                className="transform transition-all hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AchievementBadge achievement={achievement} />
              </div>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="special" className="mt-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {filterAchievements(specialAchievements).map((achievement, index) => (
              <div 
                key={achievement.id} 
                className="transform transition-all hover:scale-110"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <AchievementBadge achievement={achievement} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AchievementList;
