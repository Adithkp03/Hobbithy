import { useState, useEffect, useContext } from 'react';
import { format, addMonths, subMonths, isSameWeek } from 'date-fns';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, LogOut, BarChart2, Check, Trash2 } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import API from '../api/axios';
import { Button } from '../components/Button';
import { HabitRow } from '../components/HabitRow';
import { AddHabitModal } from '../components/AddHabitModal';

import { getDaysInMonth, formatDateKey, getWeeksInMonth } from '../utils/dateUtils';
import logo from '../assets/logo.jpg';
import { ReflectionModal } from '../components/ReflectionModal';

export default function Dashboard() {
    const [user, setUser] = useState(useContext(AuthContext).user);
    const { logout } = useContext(AuthContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReflectionOpen, setIsReflectionOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const days = getDaysInMonth(currentDate);
    const weeks = getWeeksInMonth(currentDate);

    const dailyHabits = habits.filter(h => !h.frequency || h.frequency === 'daily');
    const weeklyHabits = habits.filter(h => h.frequency === 'weekly');

    // Fetch Habits
    const fetchHabits = async () => {
        try {
            const res = await API.get('/habits');
            setHabits(res.data);
        } catch (error) {
            console.error('Error fetching habits:', error);
        }
    };

    // Fetch Logs for the month
    const fetchLogs = async () => {
        try {
            const year = format(currentDate, 'yyyy');
            const month = format(currentDate, 'MM');
            const res = await API.get(`/logs/month?year=${year}&month=${month}`);
            setLogs(res.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };



    // Check for Due Reflection
    const checkReflectionStatus = async () => {
        try {
            const res = await API.get('/reflections/latest');
            if (res.data.isDue) {
                // Add a small delay so it doesn't pop up instantly on login
                setTimeout(() => setIsReflectionOpen(true), 1500);
            }
        } catch (error) {
            console.error('Error checking reflection status:', error);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchHabits(), fetchLogs()]);
            await checkReflectionStatus();
            setLoading(false);
        };
        loadData();
    }, [currentDate]);

    // Handle Reflection Submission
    const handleReflectionSubmit = async (answers) => {
        try {
            await API.post('/reflections', { answers });
            setIsReflectionOpen(false);
            // Could show a success toast here
        } catch (error) {
            console.error('Error submitting reflection:', error);
        }
    };

    // Handle Toggle (Cycle: Empty -> 100 -> 50 -> 25 -> Empty)
    const handleToggle = async (habitId, date) => {
        try {
            const existingLog = logs.find(l => l.habitId === habitId && l.date === date);

            // Calculate next score
            let nextScore;
            // Handle legacy "status: true" as 100
            const currentScore = existingLog ? (existingLog.score !== undefined ? existingLog.score : (existingLog.status ? 100 : 0)) : 0;

            if (currentScore === 0) nextScore = 100;      // Empty -> Full
            else if (currentScore === 100) nextScore = 50; // Full -> Partial
            else if (currentScore === 50) nextScore = 25;  // Partial -> Blocked
            else if (currentScore === 25) nextScore = 0;   // Blocked -> Empty
            else nextScore = 100; // Fallback

            // Optimistic Update
            let newLogs;
            if (nextScore === 0) {
                // Remove log
                newLogs = logs.filter(l => !(l.habitId === habitId && l.date === date));
            } else {
                if (existingLog) {
                    newLogs = logs.map(l =>
                        l.habitId === habitId && l.date === date
                            ? { ...l, score: nextScore, status: undefined } // clear legacy status
                            : l
                    );
                } else {
                    newLogs = [...logs, { habitId, date, score: nextScore }];
                }
            }
            setLogs(newLogs);

            // API Call
            await API.post('/logs', { habitId, date, score: nextScore });
        } catch (error) {
            console.error('Toggle failed', error);
            fetchLogs(); // Revert on error
        }
    };



    const handleAddHabit = async (habitData) => {
        try {
            const res = await API.post('/habits', habitData);
            setHabits([...habits, res.data]);
        } catch (error) {
            console.error('Error adding habit:', error);
        }
    };

    const handleDeleteHabit = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await API.delete(`/habits/${id}`);
            setHabits(habits.filter(h => h._id !== id));
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-white border-b border-slate-200 z-20">
                <div className="max-w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-2">
                            <img src={logo} alt="Hobbithy" className="w-10 h-10 rounded-lg object-cover" />
                            <span className="text-xl font-bold text-slate-900 tracking-tight">Hobbithy</span>
                        </div>
                        <div className="flex items-center space-x-6">
                            <span className="text-slate-600 text-sm hidden sm:block">Welcome back, <span className="font-semibold text-slate-900">{user?.username}</span></span>
                            <Button variant="ghost" onClick={logout} className="text-slate-500 hover:text-red-500">
                                <LogOut size={20} />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col p-4 sm:p-6 lg:p-8">
                {/* Header & Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center bg-white rounded-lg shadow-sm border border-slate-200 p-1">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-50 rounded-md text-slate-500 hover:text-primary-600 transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <span className="px-4 font-semibold text-slate-700 w-32 text-center">
                            {format(currentDate, 'MMMM yyyy')}
                        </span>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-slate-50 rounded-md text-slate-500 hover:text-primary-600 transition-colors">
                            <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">

                        <Link to="/analytics">
                            <Button variant="outline" className="flex items-center gap-2">
                                <BarChart2 size={20} />
                                <span className="hidden sm:inline">Analytics</span>
                            </Button>
                        </Link>
                        <Link to="/reflections">
                            <Button variant="outline" className="flex items-center gap-2">
                                <span className="hidden sm:inline">History</span>
                            </Button>
                        </Link>
                        <Button onClick={() => setIsModalOpen(true)} className="shadow-sm shadow-primary-500/30">
                            <Plus size={20} className="mr-2" />
                            New Habit
                        </Button>
                    </div>
                </div>

                {/* Habit Grid - Single Scroll Container */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 overflow-auto relative">
                    <div className="min-w-fit">
                        {/* Sticky Header Row */}
                        <div className="flex items-center border-b border-slate-200 bg-slate-50/50 sticky top-0 z-30">
                            {/* Sticky Name Column */}
                            <div className="w-64 flex-none p-4 font-semibold text-slate-500 text-sm sticky left-0 bg-slate-50 z-40 border-r border-slate-200 shadow-[4px_0_24px_-4px_rgba(0,0,0,0.1)]">
                                HABITS
                            </div>
                            {/* Scrollable Dates Header */}
                            <div className="flex-1 flex bg-slate-50/50">
                                {days.map(day => (
                                    <div key={day.toString()} className="flex-1 min-w-[40px] py-3 flex flex-col items-center justify-center border-r border-slate-200/50 last:border-0 bg-slate-50/50">
                                        <span className="text-xs font-medium text-slate-400 uppercase">{format(day, 'EEE')}</span>
                                        <span className={`text-sm font-semibold mt-1 ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') ? 'text-primary-600 bg-primary-50 w-6 h-6 rounded-full flex items-center justify-center' : 'text-slate-700'}`}>
                                            {format(day, 'd')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Scrollable Rows (Body) */}
                        <div className="divide-y divide-slate-100">
                            {loading ? (
                                <div className="p-12 text-center text-slate-400">Loading habits...</div>
                            ) : dailyHabits.length === 0 ? (
                                <div className="p-8 text-center">
                                    <h3 className="text-sm font-medium text-slate-900">No daily habits</h3>
                                </div>
                            ) : (
                                dailyHabits.map(habit => (
                                    <HabitRow
                                        key={habit._id}
                                        habit={habit}
                                        days={days}
                                        logs={logs}
                                        onToggle={handleToggle}
                                        onDelete={handleDeleteHabit}
                                        isBadDay={false}
                                    />
                                ))
                            )}
                        </div>

                        {/* Completion Rate Footer */}
                        {dailyHabits.length > 0 && (
                            <div className="flex items-center border-t border-slate-200 bg-slate-50/50 sticky bottom-0 z-30">
                                <div className="w-64 flex-none p-4 font-semibold text-slate-500 text-sm sticky left-0 bg-slate-50 z-20 border-r border-slate-200">
                                    COMPLETION
                                </div>
                                <div className="flex-1 flex">
                                    {days.map(day => {
                                        const dateKey = formatDateKey(day);
                                        const dayLogs = logs.filter(l => l.date === dateKey && dailyHabits.some(h => h._id === l.habitId));

                                        const totalScore = dayLogs.reduce((acc, log) => acc + (log.score || 0), 0);
                                        const maxScore = dailyHabits.length * 100;
                                        const rate = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

                                        let textColor = 'text-slate-400';
                                        if (rate >= 80) textColor = 'text-green-600 font-bold';
                                        else if (rate >= 50) textColor = 'text-blue-600 font-medium';
                                        else if (rate > 0) textColor = 'text-slate-600';

                                        return (
                                            <div key={day.toString()} className="flex-1 min-w-[40px] py-3 flex items-center justify-center border-r border-slate-200/50 last:border-0">
                                                <span className={`text-xs ${textColor}`}>
                                                    {rate}%
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* WEEKLY HABITS SECTION */}
                {weeklyHabits.length > 0 && (
                    <div className="mt-8">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 px-1">Weekly Habits</h2>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
                            <div className="min-w-fit">
                                {/* Header */}
                                <div className="flex items-center border-b border-slate-200 bg-slate-50/50">
                                    <div className="w-64 flex-none p-4 font-semibold text-slate-500 text-sm sticky left-0 bg-slate-50 z-20 border-r border-slate-200">
                                        HABITS
                                    </div>
                                    <div className="flex-1 flex">
                                        {weeks.map((week, index) => (
                                            <div key={week.id} className="flex-1 min-w-[100px] py-3 flex flex-col items-center justify-center border-r border-slate-200/50 last:border-0">
                                                <span className="text-xs font-medium text-slate-400 uppercase">Week {index + 1}</span>
                                                <span className="text-xs text-slate-500 mt-1">
                                                    {format(week.start, 'MMM d')} - {format(week.end, 'MMM d')}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="divide-y divide-slate-100">
                                    {weeklyHabits.map(habit => (
                                        <div key={habit._id} className="flex items-center hover:bg-slate-50 transition-colors">
                                            <div className="w-64 flex-none p-4 flex items-center justify-between sticky left-0 bg-white border-r border-slate-100 z-10">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color }} />
                                                    <span className="font-medium text-slate-700 truncate">{habit.name}</span>
                                                </div>
                                                <button onClick={() => handleDeleteHabit(habit._id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="flex-1 flex">
                                                {weeks.map(week => {
                                                    // Check if any log exists in this week range
                                                    // Simplified check: Use the 'start' date of the week as the key for weekly habits for now
                                                    // Or better: Check if ANY log exists within the week range.
                                                    // For Simplicity in this iteration: We will save the log using the week's Start Date as the key.
                                                    const weekKey = formatDateKey(week.start);
                                                    const log = logs.find(l => l.habitId === habit._id && l.date === weekKey);
                                                    const isCompleted = log && log.score === 100;

                                                    return (
                                                        <div key={week.id} className="flex-1 min-w-[100px] h-14 flex items-center justify-center border-r border-slate-50 last:border-0">
                                                            <button
                                                                onClick={() => handleToggle(habit._id, weekKey)}
                                                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'text-white' : 'text-slate-200 hover:bg-slate-100'}`}
                                                                style={{ backgroundColor: isCompleted ? habit.color : 'transparent' }}
                                                            >
                                                                {isCompleted ? (
                                                                    <Check size={16} strokeWidth={3} />
                                                                ) : (
                                                                    <div className="w-3 h-3 rounded-full bg-slate-300" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <AddHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddHabit}
            />

            <ReflectionModal
                isOpen={isReflectionOpen}
                onClose={() => setIsReflectionOpen(false)}
                onSubmit={handleReflectionSubmit}
            />
        </div>
    );
}
