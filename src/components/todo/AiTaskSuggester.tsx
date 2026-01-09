'use client';

import { useState } from 'react';
import { suggestTasks } from '@/ai/flows/ai-suggest-tasks';
import { Button } from '@/components/ui/button';
import { Wand2, Plus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';

interface AiTaskSuggesterProps {
  currentTasks: string[];
  onAddSuggestedTask: (text: string) => void;
}

export default function AiTaskSuggester({ currentTasks, onAddSuggestedTask }: AiTaskSuggesterProps) {
  const [suggestedTasks, setSuggestedTasks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const handleSuggestTasks = async () => {
    setIsLoading(true);
    setSuggestedTasks([]);
    try {
      const result = await suggestTasks({
        timeOfDay: getTimeOfDay(),
        previousTasks: currentTasks,
      });
      setSuggestedTasks(result.suggestedTasks);
    } catch (error) {
      console.error('Error suggesting tasks:', error);
      toast({
        variant: "destructive",
        title: "AI Suggestion Failed",
        description: "Could not get suggestions from the AI. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddTask = (task: string) => {
    onAddSuggestedTask(task);
    setSuggestedTasks(tasks => tasks.filter(t => t !== task));
  };

  return (
    <Card className="mt-8 overflow-hidden bg-gradient-to-br from-[#E0DBFF]/30 to-background border-[#BDB2FF]/50 shadow-lg">
      <CardHeader className="flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-lg bg-white shadow-inner">
            <Wand2 className="h-6 w-6 text-[#7057FF]" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">AI Task Suggester</CardTitle>
            <CardDescription>Get smart recommendations for your next task.</CardDescription>
          </div>
        </div>
        <Button onClick={handleSuggestTasks} disabled={isLoading} variant="ghost" className="bg-white hover:bg-gray-100">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Suggesting...
            </>
          ) : (
            'Suggest Tasks'
          )}
        </Button>
      </CardHeader>
      {(isLoading || suggestedTasks.length > 0) && (
        <CardContent>
          {isLoading && suggestedTasks.length === 0 && (
            <div className="space-y-3 pt-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-8 w-5/6" />
            </div>
          )}
          {suggestedTasks.length > 0 && (
            <div className="pt-4">
              <h4 className="mb-2 text-sm font-medium text-muted-foreground">Suggestions:</h4>
              <ul className="space-y-2">
                <AnimatePresence>
                {suggestedTasks.map((task, index) => (
                  <motion.li 
                    key={index} 
                    className="group flex items-center justify-between rounded-md bg-background/50 p-2 text-sm"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span>{task}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => handleAddTask(task)}
                      aria-label={`Add task: ${task}`}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </motion.li>
                ))}
                </AnimatePresence>
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
