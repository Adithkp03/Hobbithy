import { useState, useEffect } from 'react';
import { X, Check, Plus, Loader2, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import API from '../api/axios';

export function TasksModal({ isOpen, onClose }) {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskType, setNewTaskType] = useState('day'); // 'day' or 'week'
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Tasks</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {/* Add Task Form */}
                    <form onSubmit={handleAddTask} className="mb-6 space-y-3">
                        <input
                            type="text"
                            placeholder="Add a new task..."
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="h-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all min-w-[140px] justify-between"
                                >
                                    <span>{newTaskType === 'day' ? 'For Today' : 'For This Week'}</span>
                                    <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                                        <div className="absolute top-full left-0 mt-2 w-full min-w-[160px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                                            <button
                                                type="button"
                                                onClick={() => { setNewTaskType('day'); setIsDropdownOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${newTaskType === 'day'
                                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                    }`}
                                            >
                                                For Today
                                                {newTaskType === 'day' && <Check size={14} />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => { setNewTaskType('week'); setIsDropdownOpen(false); }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${newTaskType === 'week'
                                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium'
                                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                                    }`}
                                            >
                                                For This Week
                                                {newTaskType === 'week' && <Check size={14} />}
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
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
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-sm transition-all group">
            <span className="text-slate-700 dark:text-slate-200 font-medium">{task.title}</span>
            <button
                onClick={() => onComplete(task._id)}
                className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                title="Mark Complete"
            >
                <Check size={16} strokeWidth={3} />
            </button>
        </div>
    );
}
