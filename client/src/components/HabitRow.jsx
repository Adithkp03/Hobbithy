import { Check } from 'lucide-react';
import clsx from 'clsx';
import { formatDateKey } from '../utils/dateUtils';

export function HabitRow({ habit, days, logs, onToggle, onDelete }) {
    return (
        <div className="flex items-center border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
            {/* Habit Name Column */}
            <div className="w-1/4 min-w-[200px] p-4 flex items-center justify-between sticky left-0 bg-white border-r border-slate-100 z-10">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                    />
                    <span className="font-medium text-slate-700 truncate">{habit.name}</span>
                </div>
                <button
                    onClick={() => onDelete(habit._id)}
                    className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete Habit"
                >
                    &times;
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 flex">
                {days.map((day) => {
                    const dateKey = formatDateKey(day);
                    const log = logs.find(l => l.habitId === habit._id && l.date === dateKey);
                    const isCompleted = log?.status;

                    return (
                        <div
                            key={dateKey}
                            className="flex-1 min-w-[40px] h-14 flex items-center justify-center border-r border-slate-50 last:border-0"
                        >
                            <button
                                onClick={() => onToggle(habit._id, dateKey)}
                                className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200",
                                    isCompleted
                                        ? "bg-opacity-10 text-white transform scale-100"
                                        : "bg-slate-100 text-transparent hover:bg-slate-200"
                                )}
                                style={{
                                    backgroundColor: isCompleted ? habit.color : undefined,
                                    color: isCompleted ? 'white' : 'transparent'
                                }}
                            >
                                <Check size={16} strokeWidth={3} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
