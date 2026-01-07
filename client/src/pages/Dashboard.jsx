import { useState, useEffect, useContext } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, LogOut } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import API from '../api/axios';
import { Button } from '../components/Button';
import { HabitRow } from '../components/HabitRow';
import { AddHabitModal } from '../components/AddHabitModal';
import { getDaysInMonth, formatDateKey } from '../utils/dateUtils';

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [habits, setHabits] = useState([]);
    const [logs, setLogs] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const days = getDaysInMonth(currentDate);

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

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchHabits(), fetchLogs()]);
            setLoading(false);
        };
        loadData();
    }, [currentDate]);

    const handleToggle = async (habitId, date) => {
        try {
            // Optimistic update
            const existingLog = logs.find(l => l.habitId === habitId && l.date === date);
            let newLogs;

            if (existingLog) {
                newLogs = logs.map(l =>
                    l.habitId === habitId && l.date === date
                        ? { ...l, status: !l.status }
                        : l
                );
            } else {
                newLogs = [...logs, { habitId, date, status: true }];
            }
            setLogs(newLogs);

            // API Call
            await API.post('/logs', { habitId, date });
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
                            <div className="bg-primary-600 p-2 rounded-lg">
                                <span className="text-white font-bold text-xl">H</span>
                            </div>
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

                    <Button onClick={() => setIsModalOpen(true)} className="shadow-sm shadow-primary-500/30">
                        <Plus size={20} className="mr-2" />
                        New Habit
                    </Button>
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
                            ) : habits.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                                        <Plus size={32} className="text-slate-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-900">No habits yet</h3>
                                    <p className="text-slate-500 mt-1">Create your first habit to start tracking!</p>
                                </div>
                            ) : (
                                habits.map(habit => (
                                    <HabitRow
                                        key={habit._id}
                                        habit={habit}
                                        days={days}
                                        logs={logs}
                                        onToggle={handleToggle}
                                        onDelete={handleDeleteHabit}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <AddHabitModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdd={handleAddHabit}
            />
        </div>
    );
}
