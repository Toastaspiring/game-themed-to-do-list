
import React, { useState, useEffect } from 'react';
import { useTaskContext } from '@/contexts/TaskContext';
import TaskItem from './TaskItem';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Target, ListTodo } from 'lucide-react';

const TaskList: React.FC = () => {
  const { tasks } = useTaskContext();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  // Update filtered tasks whenever tasks or active tab changes
  useEffect(() => {
    const newFilteredTasks = tasks.filter(task => {
      if (activeTab === 'all') return true;
      return task.category === activeTab;
    });
    setFilteredTasks(newFilteredTasks);
  }, [tasks, activeTab]);
  
  const completedCount = filteredTasks.filter(t => t.completed).length;
  const totalTasks = filteredTasks.length;
  const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;

  return (
    <div className="mb-6 animate-pixel-fade-in">
      <div className="mb-4">
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 bg-game-background border border-game-primary">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-game-primary data-[state=active]:text-white"
            >
              <ListTodo size={16} className="mr-2" />
              All
            </TabsTrigger>
            <TabsTrigger 
              value="daily" 
              className="data-[state=active]:bg-game-primary data-[state=active]:text-white"
            >
              <Calendar size={16} className="mr-2" />
              Daily
            </TabsTrigger>
            <TabsTrigger 
              value="goal" 
              className="data-[state=active]:bg-game-primary data-[state=active]:text-white"
            >
              <Target size={16} className="mr-2" />
              Goals
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span>{completedCount}/{totalTasks} tasks</span>
            </div>
            <div className="pixel-progress">
              <div
                style={{ width: `${progressPercentage}%` }}
                className="transition-all duration-500"
              />
            </div>
          </div>

          <TabsContent value="all">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => <TaskItem key={task.id} task={task} />)
            ) : (
              <div className="text-center py-8 text-game-text-muted">No tasks available</div>
            )}
          </TabsContent>
          
          <TabsContent value="daily">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => <TaskItem key={task.id} task={task} />)
            ) : (
              <div className="text-center py-8 text-game-text-muted">No daily tasks available</div>
            )}
          </TabsContent>
          
          <TabsContent value="goal">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => <TaskItem key={task.id} task={task} />)
            ) : (
              <div className="text-center py-8 text-game-text-muted">No goals available</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TaskList;
