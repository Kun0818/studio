'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface AddTaskFormProps {
  onAddTask: (text: string) => void;
}

export default function AddTaskForm({ onAddTask }: AddTaskFormProps) {
  const [text, setText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTask(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <Input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-grow text-base"
        aria-label="New task"
      />
      <Button type="submit" size="icon" aria-label="Add task">
        <Plus className="h-5 w-5" />
      </Button>
    </form>
  );
}
