import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

export function AddHabitModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#3b82f6');
    const [frequency, setFrequency] = useState('daily');
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ name, color, frequency });
        setName('');
        setColor('#3b82f6');
        setFrequency('daily');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md p-6 transition-colors duration-300">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add New Habit</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Habit Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Read 30 mins"
                        required
                        autoFocus
                    />

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Frequency</label>
                        <div className="flex bg-slate-100 dark:bg-slate-700 p-1 rounded-lg transition-colors duration-300">
                            <button
                                type="button"
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${frequency === 'daily' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                onClick={() => setFrequency('daily')}
                            >
                                Daily
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${frequency === 'weekly' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                                onClick={() => setFrequency('weekly')}
                            >
                                Weekly
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color</label>
                        <div className="flex flex-wrap gap-2">
                            {colors.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${color === c ? 'border-slate-800 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Create Habit</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
