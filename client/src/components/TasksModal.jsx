import { useState, useEffect } from 'react';
import { X, Check, Plus, Loader2 } from 'lucide-react';
import { Button } from './Button';
import API from '../api/axios';

export function TasksModal({ isOpen, onClose }) {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskType, setNewTaskType] = useState('day'); // 'day' or 'week'
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchTasks();
        }
    }, [isOpen]);

    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await API.get('/tasks');
            setTasks(res.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            setAdding(true);
            const res = await API.post('/tasks', {
                title: newTaskTitle,
                type: newTaskType
            });
            setTasks([res.data, ...tasks]);
            setNewTaskTitle('');
        } catch (error) {
            console.error('Error adding task:', error);
        } finally {
            setAdding(false);
        }
    };

    const handleCompleteTask = async (taskId) => {
        // Optimistic update
        const originalTasks = [...tasks];
        setTasks(tasks.filter(t => t._id !== taskId));

        try {
            await API.delete(`/tasks/${taskId}`);
        } catch (error) {
            console.error('Error completing task:', error);
            setTasks(originalTasks); // Revert
        }
    };

    if (!isOpen) return null;

    const dayTasks = tasks.filter(t => t.type === 'day');
    const weekTasks = tasks.filter(t => t.type === 'week');

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800">Tasks</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Add Task Form */}
                    <form onSubmit={handleAddTask} className="mb-6 space-y-3">
                        <input
                            type="text"
                            placeholder="Add a new task..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <select
                                className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={newTaskType}
                                onChange={(e) => setNewTaskType(e.target.value)}
                            >
                                <option value="day">For Today</option>
                                <option value="week">For This Week</option>
                            </select>
                            <Button type="submit" disabled={!newTaskTitle.trim() || adding} className="flex-1">
                                {adding ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} className="mr-2" />}
                                {adding ? 'Adding...' : 'Add Task'}
                            </Button>
                        </div>
                    </form>

                    {/* Task Lists */}
                    {loading ? (
                        <div className="flex justify-center py-8 text-slate-400">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                            {/* Day Tasks */}
                            <div>
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Today</h3>
                                <div className="space-y-2">
                                    {dayTasks.length === 0 && <p className="text-sm text-slate-400 italic">No tasks for today</p>}
                                    {dayTasks.map(task => (
                                        <TaskItem key={task._id} task={task} onComplete={handleCompleteTask} />
                                    ))}
                                </div>
                            </div>

                            {/* Week Tasks */}
                            <div>
                                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">This Week</h3>
                                <div className="space-y-2">
                                    {weekTasks.length === 0 && <p className="text-sm text-slate-400 italic">No tasks for this week</p>}
                                    {weekTasks.map(task => (
                                        <TaskItem key={task._id} task={task} onComplete={handleCompleteTask} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function TaskItem({ task, onComplete }) {
    return (
        <div className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all group">
            <span className="text-slate-700 font-medium">{task.title}</span>
            <button
                onClick={() => onComplete(task._id)}
                className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-300 hover:border-green-500 hover:bg-green-50 hover:text-green-600 transition-all"
                title="Mark Complete"
            >
                <Check size={16} strokeWidth={3} />
            </button>
        </div>
    );
}
