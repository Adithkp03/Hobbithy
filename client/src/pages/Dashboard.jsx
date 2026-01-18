import { useState, useEffect, useContext, useMemo } from 'react';
import { format, addMonths, subMonths, isSameWeek, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';
import { Link } from 'react-router-dom';
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    LogOut,
    BarChart2,
    Check,
    Trash2,
    CheckSquare,
    Activity,
    Calendar,
    Clock,
    ListTodo,
    Award,
    Settings
} from 'lucide-react';
import AuthContext from '../context/AuthContext';
import API from '../api/axios';
import { Button } from '../components/Button';
import { AddHabitModal } from '../components/AddHabitModal';
import { TasksModal } from '../components/TasksModal';
import { LoadingScreen } from '../components/LoadingScreen';
import { ReflectionModal } from '../components/ReflectionModal';
import { getDaysInMonth, formatDateKey, getWeeksInMonth } from '../utils/dateUtils';
import logo from '../assets/logo.jpg';
import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
    const [isReflectionOpen, setIsReflectionOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('monthly'); // monthly, weekly

    const days = getDaysInMonth(currentDate);
    const weeks = getWeeksInMonth(currentDate);

    const dailyHabits = habits.filter(h => !h.frequency || h.frequency === 'daily');
    const weeklyHabits = habits.filter(h => h.frequency === 'weekly');

    // --- DATA FETCHING ---
    const fetchHabits = async () => {
        try {
            const res = await API.get('/habits');
            setHabits(res.data);
        } catch (error) {
            console.error('Error fetching habits:', error);
        }
    };

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

    const checkReflectionStatus = async () => {
        try {
            const res = await API.get('/reflections/latest');
            if (res.data.isDue) {
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

    // --- ACTIONS ---
    const handleToggle = async (habitId, date) => {
        try {
            const existingLog = logs.find(l => l.habitId === habitId && l.date === date);

            // Toggle Logic: 0 -> 100 -> 0 (Simplified for the new UI which implies binary or check)
            // But per previous requirements, we have 100/50/25/0.
            // The new UI shows a simple checkmark. Let's keep the cycling logic but visually it might just show check or no check.
            // Actually, for "Increase User Experience" and the new UI's simple check circle, maybe we should stick to simple toggle?
            // "dont change the api endpoints, also use only the data that we have"
            // Let's stick to the cycle but maybe just visualize >0 as checked? 
            // Or better: Let's allow the cycle.

            const currentScore = existingLog ? (existingLog.score !== undefined ? existingLog.score : (existingLog.status ? 100 : 0)) : 0;

            let nextScore;
            if (currentScore === 0) nextScore = 100;
            else if (currentScore === 100) nextScore = 50;
            else if (currentScore === 50) nextScore = 25;
            else if (currentScore === 25) nextScore = 0;
            else nextScore = 100;

            // Optimistic Update
            let newLogs;
            if (nextScore === 0) {
                newLogs = logs.filter(l => !(l.habitId === habitId && l.date === date));
            } else {
                if (existingLog) {
                    newLogs = logs.map(l => l.habitId === habitId && l.date === date ? { ...l, score: nextScore } : l);
                } else {
                    newLogs = [...logs, { habitId, date, score: nextScore }];
                }
            }
            setLogs(newLogs);
            await API.post('/logs', { habitId, date, score: nextScore });
        } catch (error) {
            console.error('Toggle failed', error);
            fetchLogs();
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
        if (!window.confirm('Delete this habit?')) return;
        try {
            await API.delete(`/habits/${id}`);
            setHabits(habits.filter(h => h._id !== id));
        } catch (error) {
            console.error('Error deleting habit:', error);
        }
    };

    const handleReflectionSubmit = async (answers) => {
        try {
            await API.post('/reflections', { answers });
            setIsReflectionOpen(false);
        } catch (error) {
            console.error('Error submitting reflection:', error);
        }
    };

    // --- DERIVED DATA ---
    const dailyCompletionData = useMemo(() => {
        return days.map(day => {
            const dateKey = formatDateKey(day);
            // Only count daily habits for this chart
            const habitsForDay = dailyHabits;
            if (habitsForDay.length === 0) return { day, percent: 0, dateKey };

            const totalScore = habitsForDay.reduce((acc, h) => {
                const log = logs.find(l => l.habitId === h._id && l.date === dateKey);
                return acc + (log ? (log.score || 0) : 0);
            }, 0);

            const maxScore = habitsForDay.length * 100;
            return {
                day: format(day, 'd'),
                fullDate: day,
                percent: maxScore > 0 ? (totalScore / maxScore) * 100 : 0
            };
        });
    }, [logs, dailyHabits, days]);

    // Summary Stats
    const getBestHabit = () => {
        if (habits.length === 0) return null;
        // Count logs for current month per habit
        const counts = habits.map(h => {
            const count = logs.filter(l => l.habitId === h._id && l.score > 0).length;
            return { ...h, count };
        });
        return counts.sort((a, b) => b.count - a.count)[0];
    };

    const getMonthProgress = () => {
        const totalPotential = (dailyHabits.length * days.length) + (weeklyHabits.length * 4); // Approximately
        if (totalPotential === 0) return 0;
        const totalScore = logs.reduce((acc, l) => acc + (l.score || 0), 0);
        // Normalize 100 score to 1 unit
        const totalCompletedUnits = totalScore / 100;
        return Math.round((totalCompletedUnits / totalPotential) * 100);
    };

    const bestHabit = getBestHabit();
    const monthProgress = getMonthProgress();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 transition-colors duration-300 font-sans selection:bg-emerald-100 dark:selection:bg-emerald-900">
            {/* --- TOP NAVIGATION --- */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            <img src={logo} alt="Hobbithy" className="w-8 h-8 rounded-lg object-cover shadow-sm" />
                            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white hidden sm:block">Hobbithy</span>
                        </div>

                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            {[
                                { id: 'monthly', icon: Calendar, label: 'Monthly' },
                                { id: 'weekly', icon: Clock, label: 'Weekly' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setView(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${view === tab.id
                                        ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                                        }`}
                                >
                                    <tab.icon size={16} />
                                    <span className="hidden sm:inline">{tab.label}</span>
                                </button>
                            ))}
                            <button
                                onClick={() => setIsTasksModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
                            >
                                <ListTodo size={16} />
                                <span className="hidden sm:inline">Tasks</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right mr-2">
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Welcome</p>
                            <p className="text-sm font-playfair italic font-bold text-slate-900 dark:text-white">{user?.username}</p>
                        </div>
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                        <ThemeToggle />
                        <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                        <Link to="/analytics">
                            <Button variant="ghost" className="flex items-center gap-2 text-slate-500 hover:text-emerald-600">
                                <BarChart2 size={18} />
                            </Button>
                        </Link>

                        <Button variant="ghost" onClick={logout} className="text-slate-400 hover:text-red-500">
                            <LogOut size={18} />
                        </Button>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all active:scale-95 ml-2"
                        >
                            <Plus size={18} />
                            <span className="hidden sm:inline">New Habit</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* --- HEADER SECTION --- */}
                <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                            {format(currentDate, 'MMMM yyyy')}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">
                            You've completed {logs.filter(l => l.score === 100).length} sessions this month. Keep it up!
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-xl shadow-sm dark:shadow-none">
                        <button
                            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => setCurrentDate(new Date())}
                            className="px-3 py-1.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors min-w-[80px]"
                        >
                            {format(currentDate, 'MMMM')}
                        </button>
                        <button
                            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </header>

                {loading ? (
                    <LoadingScreen message="Loading dashboard..." />
                ) : (
                    <>
                        {/* --- MAIN GRID SECTION --- */}
                        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm dark:shadow-slate-900/50 overflow-hidden mb-8">
                            <div className="overflow-x-auto scrollbar-hide">
                                <div className="min-w-[800px]">
                                    {/* Sticky Header Row */}
                                    <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 sticky top-0 z-40">
                                        <div className="w-48 md:w-80 flex-none p-4 pl-6 font-semibold text-slate-400 dark:text-white text-xs uppercase tracking-wider sticky left-0 bg-slate-50 dark:bg-slate-800 z-50 border-r border-slate-200 dark:border-slate-700 shadow-none dark:shadow-[4px_0_24px_-4px_#020617] flex items-center">
                                            {view === 'monthly' ? 'Daily Habits' : 'Weekly Habits'}
                                        </div>
                                        <div className="flex-1 flex bg-slate-800/0 px-4">
                                            {view === 'monthly' ? (
                                                days.map(day => (
                                                    <div key={day.toString()} className="flex-1 min-w-[40px] py-4 flex flex-col items-center justify-center border-r border-slate-200/50 dark:border-slate-700/50 last:border-0 bg-slate-50/50 dark:bg-slate-800">
                                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-200 uppercase tracking-widest mb-1">
                                                            {format(day, 'EEEEE')}
                                                        </span>
                                                        <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                                                            ? 'text-white bg-emerald-500 shadow-md shadow-emerald-200 dark:shadow-emerald-900/40'
                                                            : 'text-slate-500 dark:text-white'
                                                            }`}>
                                                            {format(day, 'd')}
                                                        </span>
                                                    </div>
                                                ))
                                            ) : (
                                                weeks.map((week, index) => (
                                                    <div key={week.id} className="flex-1 min-w-[100px] py-4 flex flex-col items-center justify-center border-r border-slate-200/50 dark:border-slate-700/50 last:border-0 bg-slate-50/50 dark:bg-slate-800/50">
                                                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Week {index + 1}</span>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-700/50 px-2 py-0.5 rounded-full">
                                                            {format(week.start, 'MMM d')} - {format(week.end, 'd')}
                                                        </span>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>    {/* Habit Rows */}
                                    <div className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                        {(view === 'monthly' ? dailyHabits : weeklyHabits).length === 0 && (
                                            <div className="p-12 text-center text-slate-400 italic">
                                                No {view} habits found. Create one to get started!
                                            </div>
                                        )}
                                        {view === 'monthly' ? (
                                            dailyHabits.map(habit => (
                                                <div key={habit._id} className="flex group transition-colors">
                                                    <div className="w-48 md:w-80 flex-none p-4 pl-6 flex items-center justify-between sticky left-0 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 z-30 shadow-none dark:shadow-[4px_0_24px_-4px_#020617] group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors">
                                                        <div className="flex items-center gap-3 overflow-hidden">
                                                            <div
                                                                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                                                                style={{ backgroundColor: habit.color, boxShadow: `0 0 12px ${habit.color}60` }}
                                                            />
                                                            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate text-sm">{habit.name}</span>
                                                        </div>
                                                        <button
                                                            onClick={() => handleDeleteHabit(habit._id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-rose-500 transition-all rounded-md hover:bg-rose-50"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="flex-1 flex px-4">
                                                        {days.map(day => {
                                                            const dateKey = formatDateKey(day);
                                                            const log = logs.find(l => l.habitId === habit._id && l.date === dateKey);
                                                            const score = log ? (log.score || 0) : 0;

                                                            let active = score >= 50;
                                                            let partial = score > 0 && score < 100;

                                                            return (
                                                                <div key={day.toString()} className="flex-1 min-w-[40px] py-3 flex items-center justify-center border-r border-slate-50 last:border-0 relative">
                                                                    <button
                                                                        onClick={() => handleToggle(habit._id, dateKey)}
                                                                        className={`
                                                                        w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 scale-90 hover:scale-100 z-0
                                                                        ${active || partial
                                                                                ? `shadow-sm text-white`
                                                                                : 'bg-slate-50 dark:bg-slate-700/30 text-transparent hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                                                            }
                                                                    `}
                                                                        style={active || partial ? { backgroundColor: habit.color, boxShadow: `0 4px 6px -1px ${habit.color}40` } : {}}
                                                                    >
                                                                        {active && <Check size={14} strokeWidth={3} />}
                                                                        {partial && !active && <div className="w-1.5 h-1.5 rounded-full bg-white/60" />}
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            weeklyHabits.map(habit => (
                                                <div key={habit._id} className="flex group transition-colors">
                                                    <div className="w-48 md:w-80 flex-none p-4 pl-6 flex items-center justify-between sticky left-0 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 z-30 shadow-none dark:shadow-[4px_0_24px_-4px_#020617] group-hover:bg-slate-50 dark:group-hover:bg-slate-800 transition-colors">
                                                        <div className="flex items-center space-x-3 overflow-hidden">
                                                            <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: habit.color, boxShadow: `0 0 12px ${habit.color}60` }} />
                                                            <span className="font-semibold text-slate-700 dark:text-slate-200 truncate text-sm">{habit.name}</span>
                                                        </div>
                                                        <button onClick={() => handleDeleteHabit(habit._id)} className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 flex px-4">
                                                        {weeks.map(week => {
                                                            const weekKey = formatDateKey(week.start);
                                                            const log = logs.find(l => l.habitId === habit._id && l.date === weekKey);
                                                            const isCompleted = log && log.score === 100;

                                                            return (
                                                                <div key={week.id} className="flex-1 min-w-[100px] py-4 flex items-center justify-center border-r border-slate-50 last:border-0">
                                                                    <button
                                                                        onClick={() => handleToggle(habit._id, weekKey)}
                                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm ${isCompleted ? 'text-white scale-100' : 'text-slate-200 dark:text-slate-600 bg-slate-50 dark:bg-slate-700/30 hover:bg-slate-100 dark:hover:bg-slate-700/50 scale-90 hover:scale-100'}`}
                                                                        style={{ backgroundColor: isCompleted ? habit.color : undefined, boxShadow: isCompleted ? `0 4px 6px -1px ${habit.color}40` : 'none' }}
                                                                    >
                                                                        {isCompleted ? (
                                                                            <Check size={18} strokeWidth={3} />
                                                                        ) : (
                                                                            <div className="w-2 h-2 rounded-full bg-slate-300/50" />
                                                                        )}
                                                                    </button>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Completion Row (Pills style) - Only for Monthly View */}
                                    {view === 'monthly' && dailyHabits.length > 0 && (
                                        <div className="flex border-t border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800 sticky bottom-0 z-40 backdrop-blur-sm">
                                            <div className="w-48 md:w-80 flex-none p-4 pl-6 flex items-center gap-3 sticky left-0 bg-slate-50 dark:bg-slate-800 z-50 border-r border-slate-200 dark:border-slate-700 shadow-none dark:shadow-[4px_0_24px_-4px_#020617]">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                                    <Award size={18} />
                                                </div>
                                                <span className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-white">Progress</span>
                                            </div>
                                            <div className="flex-1 flex px-4 items-center">
                                                {dailyCompletionData.map(({ day, fullDate, percent }) => (
                                                    <div key={fullDate.toString()} className="flex-1 min-w-[40px] pt-4 pb-2 flex flex-col items-center justify-end border-r border-slate-200/50 last:border-0 group relative h-16">
                                                        <div className="w-1.5 bg-slate-200 rounded-full overflow-hidden flex flex-col justify-end h-full mb-1">
                                                            <div
                                                                className="w-full bg-emerald-400 transition-all duration-700 ease-out rounded-full"
                                                                style={{ height: `${percent}%` }}
                                                            />
                                                        </div>
                                                        {/* Tooltip on hover */}
                                                        <div className="absolute -top-8 px-2 py-1 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                                            {Math.round(percent)}%
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div >
                        </div >

                        {/* --- SUMMARY SECTION --- */}
                        < div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20" >
                            <div className="bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm dark:shadow-slate-900/30">
                                <h3 className="text-slate-500 font-semibold text-sm mb-4">Consistency Leader</h3>
                                {bestHabit ? (
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
                                            style={{ backgroundColor: bestHabit.color }}
                                        >
                                            {bestHabit.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-lg">{bestHabit.name}</div>
                                            <div className="text-sm text-slate-500">{bestHabit.count} completions</div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-slate-400 italic text-sm">No significant data yet</div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-slate-800 p-6 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm dark:shadow-slate-900/30">
                                <h3 className="text-slate-500 font-semibold text-sm mb-4">Month Progress</h3>
                                <div className="flex items-end gap-2 mb-2">
                                    <span className="text-3xl font-bold">{monthProgress}%</span>
                                    <span className="text-emerald-500 text-sm font-semibold mb-1">efficiency</span>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${monthProgress}%` }} />
                                </div>
                            </div>

                            <div className="bg-emerald-500 p-6 rounded-3xl shadow-xl shadow-emerald-500/20 text-white relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-emerald-50 font-semibold text-sm mb-4">Weekly Goal</h3>
                                    <p className="text-xl font-bold mb-4">
                                        Keep pushing! Consistency is the key to lasting change.
                                    </p>
                                </div>
                                <Activity className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />
                            </div>
                        </div >
                    </>
                )
                }
            </main >

            <AddHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddHabit}
            />

            <TasksModal
                isOpen={isTasksModalOpen}
                onClose={() => setIsTasksModalOpen(false)}
            />

            <ReflectionModal
                isOpen={isReflectionOpen}
                onClose={() => setIsReflectionOpen(false)}
                onSubmit={handleReflectionSubmit}
            />

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div >
    );
}
