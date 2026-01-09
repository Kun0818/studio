import type { Task } from '@/lib/types';
import TaskItem from './TaskItem';
import { AnimatePresence, motion } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

export default function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return null;
  }
  return (
    <ul className="space-y-2">
      <AnimatePresence initial={false}>
        {tasks.map(task => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
            layout
          >
            <TaskItem
              task={task}
              onToggleTask={onToggleTask}
              onDeleteTask={onDeleteTask}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
}
