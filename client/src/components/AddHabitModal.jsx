import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';

export function AddHabitModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [color, setColor] = useState('#3b82f6');
    const colors = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e'];

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd({ name, color });
        setName('');
        setColor('#3b82f6');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Add New Habit</h2>
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
                        <label className="block text-sm font-medium text-slate-700 mb-2">Color</label>
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
