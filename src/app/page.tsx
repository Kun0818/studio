'use client';

import { useState, useEffect } from 'react';
import type { Task } from '@/lib/types';
import AddTaskForm from '@/components/todo/AddTaskForm';
import TaskList from '@/components/todo/TaskList';
import AiTaskSuggester from '@/components/todo/AiTaskSuggester';
import { Card, CardContent } from '@/components/ui/card';
import { CheckSquare2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const storedTasks = localStorage.getItem('gitdo-tasks');
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Failed to parse tasks from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('gitdo-tasks', JSON.stringify(tasks));
    }
  }, [tasks, isClient]);

  const addTask = (text: string) => {
    if (text.trim() === '') return;
    const newTask: Task = {
      id: Date.now(),
      text,
      completed: false,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };
  
  const addSuggestedTask = (text: string) => {
    addTask(text);
  };

  const uncompletedTasks = isClient ? tasks.filter(task => !task.completed) : [];
  const completedTasks = isClient ? tasks.filter(task => task.completed) : [];

  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <main className="container mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12 sm:py-16 md:py-24">
        <header className="flex items-center gap-4">
          <CheckSquare2 className="h-12 w-12 text-primary" />
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground">GitDo</h1>
            <p className="text-muted-foreground">A simple, fast, and beautiful todo list app.</p>
          </div>
        </header>

        <Card className="overflow-hidden border-border shadow-lg">
          <CardContent className="p-4 sm:p-6">
            <AddTaskForm onAddTask={addTask} />
            <div className="mt-6">
              {isClient && tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">Your task list is empty.</p>
                  <p className="text-sm text-muted-foreground/80">Add a task to get started!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <TaskList
                    tasks={uncompletedTasks}
                    onToggleTask={toggleTask}
                    onDeleteTask={deleteTask}
                  />
                  {completedTasks.length > 0 && uncompletedTasks.length > 0 && <Separator className="my-4" />}
                  {completedTasks.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-sm font-medium text-muted-foreground tracking-wide">
                        Completed ({completedTasks.length})
                      </h3>
                      <TaskList
                        tasks={completedTasks}
                        onToggleTask={toggleTask}
                        onDeleteTask={deleteTask}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <AiTaskSuggester
          currentTasks={tasks.map(t => t.text)}
          onAddSuggestedTask={addSuggestedTask}
        />
      </main>
    </div>
  );
}
