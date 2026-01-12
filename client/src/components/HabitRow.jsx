import { Check, MessageSquare, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { formatDateKey } from '../utils/dateUtils';

export function HabitRow({ habit, days, logs, onToggle, onDelete, isBadDay, onAddNote }) {
    return (
        <div className="flex items-center border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
            {/* Habit Name Column */}
            <div className="w-64 flex-none p-4 flex items-center justify-between sticky left-0 bg-white border-r border-slate-100 z-10">
                <div className="flex items-center space-x-3">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                    />
                    <span className="font-medium text-slate-700 truncate">{habit.name}</span>
                </div>
                <button
                    onClick={() => onDelete(habit._id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete Habit"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 flex">
                {days.map((day) => {
                    const dateKey = formatDateKey(day);
                    const log = logs.find(l => l.habitId === habit._id && l.date === dateKey);

                    // Determine score (Handle legacy status: true as 100)
                    const score = log ? (log.score !== undefined ? log.score : (log.status ? 100 : 0)) : 0;

                    const isToday = dateKey === formatDateKey(new Date());
                    const isBadDayContext = isToday && isBadDay;

                    // Determine Styles & Tooltip
                    let bgStyle = {};
                    let tooltip = "No log";

                    if (score === 100) {
                        bgStyle = { backgroundColor: habit.color, color: 'white' };
                        tooltip = "Fully Completed";
                    } else if (score === 50) {
                        bgStyle = { backgroundColor: '#fbbf24', color: 'white' }; // Amber-400
                        tooltip = isBadDayContext ? "Good effort!" : "Partial (50%)";
                    } else if (score === 25) {
                        bgStyle = { backgroundColor: '#fb923c', color: 'white' }; // Orange-400
                        tooltip = isBadDayContext ? "You showed up." : "Blocked (25%)";
                    } else {
                        // Empty
                        bgStyle = { color: 'transparent' };
                    }

                    return (
                        <div
                            key={dateKey}
                            className="flex-1 min-w-[40px] h-14 flex items-center justify-center border-r border-slate-50 last:border-0"
                            title={tooltip}
                        >
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                initial={false}
                                animate={{
                                    backgroundColor: bgStyle.backgroundColor || '#f1f5f9',
                                    scale: score > 0 ? 1 : 1
                                }}
                                onClick={() => onToggle(habit._id, dateKey)}
                                className={clsx(
                                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-sm group relative",
                                    score === 0 && "text-transparent hover:bg-slate-200 shadow-none"
                                )}
                                style={{
                                    color: bgStyle.color || 'transparent'
                                }}
                            >
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: score > 0 ? 1 : 0,
                                        opacity: score > 0 ? 1 : 0
                                    }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                    <Check size={16} strokeWidth={3} />
                                </motion.div>

                                {/* Memo / Note Indicator */}
                                {log?.note && (
                                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 border border-white rounded-full z-10" />
                                )}
                            </motion.button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
