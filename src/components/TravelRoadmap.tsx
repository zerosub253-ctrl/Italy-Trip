import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Mediterranean Minimalism Design
 * - Warm terracotta (#D97706) and sage green (#84CC16) palette
 * - Asymmetric vertical timeline layout
 * - Organic SVG dividers between phases
 * - Smooth animations on task completion
 */

interface Task {
  id: string;
  title: string;
  completed: boolean;
  phase: 'documents' | 'tickets' | 'packing';
}

interface Phase {
  id: 'documents' | 'tickets' | 'packing';
  title: string;
  description: string;
  icon: string;
  color: string;
}

const PHASES: Phase[] = [
  {
    id: 'documents',
    title: 'Documents',
    description: 'Prepare your travel documents',
    icon: '📋',
    color: 'from-orange-100 to-orange-50',
  },
  {
    id: 'tickets',
    title: 'Tickets',
    description: 'Book flights and accommodations',
    icon: '✈️',
    color: 'from-amber-100 to-amber-50',
  },
  {
    id: 'packing',
    title: 'Packing',
    description: 'Pack your luggage',
    icon: '🧳',
    color: 'from-yellow-100 to-yellow-50',
  },
];

const DEFAULT_TASKS: Task[] = [
  // Documents phase
  { id: '1', title: 'Check passport validity', completed: false, phase: 'documents' },
  { id: '2', title: 'Apply for visa if needed', completed: false, phase: 'documents' },
  { id: '3', title: 'Get travel insurance', completed: false, phase: 'documents' },
  { id: '4', title: 'Make copies of important documents', completed: false, phase: 'documents' },

  // Tickets phase
  { id: '5', title: 'Book flights', completed: false, phase: 'tickets' },
  { id: '6', title: 'Reserve hotel or accommodation', completed: false, phase: 'tickets' },
  { id: '7', title: 'Book train tickets (if needed)', completed: false, phase: 'tickets' },
  { id: '8', title: 'Arrange airport transfers', completed: false, phase: 'tickets' },

  // Packing phase
  { id: '9', title: 'Pack clothing for all weather', completed: false, phase: 'packing' },
  { id: '10', title: 'Pack toiletries and medications', completed: false, phase: 'packing' },
  { id: '11', title: 'Pack electronics and chargers', completed: false, phase: 'packing' },
  { id: '12', title: 'Pack comfortable walking shoes', completed: false, phase: 'packing' },
];

export default function TravelRoadmap() {
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [newTaskPhase, setNewTaskPhase] = useState<'documents' | 'tickets' | 'packing'>('documents');
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Load tasks from LocalStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('travelRoadmapTasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (error) {
        console.error('Failed to load tasks from LocalStorage:', error);
      }
    }
  }, []);

  // Save tasks to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('travelRoadmapTasks', JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false,
        phase: newTaskPhase,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
    }
  };

  const getTasksByPhase = (phase: 'documents' | 'tickets' | 'packing') => {
    return tasks.filter(task => task.phase === phase);
  };

  const getPhaseProgress = (phase: 'documents' | 'tickets' | 'packing') => {
    const phaseTasks = getTasksByPhase(phase);
    if (phaseTasks.length === 0) return 0;
    const completed = phaseTasks.filter(t => t.completed).length;
    return Math.round((completed / phaseTasks.length) * 100);
  };

  const totalProgress = tasks.length === 0 ? 0 : Math.round(
    (tasks.filter(t => t.completed).length / tasks.length) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                Italy Trip Roadmap
              </h1>
              <p className="text-muted-foreground mt-2">Prepare for your Italian adventure</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-primary">{totalProgress}%</div>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Timeline */}
        <div className="space-y-16">
          {PHASES.map((phase, phaseIndex) => {
            const phaseTasks = getTasksByPhase(phase.id);
            const progress = getPhaseProgress(phase.id);

            return (
              <div key={phase.id} className="relative">
                {/* Phase Header */}
                <div className="flex items-start gap-6 mb-8">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-100 to-orange-50 border-2 border-primary shadow-sm">
                      <span className="text-3xl">{phase.icon}</span>
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h2 className="text-3xl font-bold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {phase.title}
                    </h2>
                    <p className="text-muted-foreground mt-1">{phase.description}</p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="flex-grow bg-border rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-primary min-w-fit">{progress}%</span>
                    </div>
                  </div>
                </div>

                {/* Tasks */}
                <div className="ml-8 space-y-3 mb-8">
                  {phaseTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-white border border-border hover:shadow-md transition-all duration-200 group"
                      style={{
                        animation: `slideIn 0.3s ease-out ${index * 50}ms both`,
                      }}
                    >
                      <Checkbox
                        checked={task.completed}
                        onCheckedChange={() => toggleTask(task.id)}
                        className="w-6 h-6 flex-shrink-0 cursor-pointer"
                      />
                      <span
                        className={`flex-grow text-base transition-all duration-200 ${
                          task.completed
                            ? 'line-through text-muted-foreground'
                            : 'text-foreground'
                        }`}
                      >
                        {task.title}
                      </span>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0 p-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        aria-label="Delete task"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Phase Divider */}
                {phaseIndex < PHASES.length - 1 && (
                  <div className="relative h-12 my-8 flex items-center justify-center">
                    <svg
                      viewBox="0 0 100 40"
                      className="w-full h-full text-border"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 0 20 Q 25 5, 50 20 T 100 20"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Task Section */}
        <div className="mt-16 p-6 rounded-lg bg-gradient-to-br from-orange-50 to-yellow-50 border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-4">Add a New Task</h3>
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <select
                value={newTaskPhase}
                onChange={(e) => setNewTaskPhase(e.target.value as 'documents' | 'tickets' | 'packing')}
                className="px-4 py-2 rounded-lg border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {PHASES.map(phase => (
                  <option key={phase.id} value={phase.id}>
                    {phase.title}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                placeholder="Enter a new task..."
                className="flex-grow px-4 py-2 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                onClick={addTask}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
              >
                <Plus size={20} />
                Add
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        input:focus,
        select:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
}
