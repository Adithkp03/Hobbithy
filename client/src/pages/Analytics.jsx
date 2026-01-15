import { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';
import { motion } from 'framer-motion';
import { ArrowLeft, LogOut, BarChart2, Calendar, Target, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import AuthContext from '../context/AuthContext';
import { Button } from '../components/Button';
import { LoadingScreen } from '../components/LoadingScreen';
import logo from '../assets/logo.jpg';

export default function Analytics() {
    const { user, logout } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await API.get('/analytics');
                setData(res.data);
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <LoadingScreen message="Calculating insights..." />;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-100">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center gap-2 group">
                            <img src={logo} alt="Hobbithy" className="w-8 h-8 rounded-lg object-cover shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="font-bold text-lg tracking-tight text-slate-900 hidden sm:block">Hobbithy</span>
                        </Link>

                        <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl">
                            <Link to="/dashboard">
                                <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 transition-all">
                                    <ArrowLeft size={16} />
                                    Back to Dashboard
                                </button>
                            </Link>
                            <button className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-white text-emerald-600 shadow-sm transition-all">
                                <BarChart2 size={16} />
                                Analytics
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right mr-2">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Welcome</p>
                            <p className="text-sm font-semibold text-slate-700">{user?.username}</p>
                        </div>
                        <Button variant="ghost" onClick={logout} className="text-slate-400 hover:text-red-500">
                            <LogOut size={18} />
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="mb-10">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Progress Insights</h1>
                    <p className="text-slate-500 text-lg">Detailed breakdown of your habit consistency and growth.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatsCard
                        icon={Target}
                        title="Total Habits"
                        value={data?.stats?.totalHabits || 0}
                        color="bg-emerald-500"
                    />
                    <StatsCard
                        icon={Calendar}
                        title="Sessions Completed"
                        value={data?.stats?.totalLogs || 0}
                        color="bg-blue-500"
                    />
                    <StatsCard
                        icon={TrendingUp}
                        title="Completion Rate"
                        value={data?.stats?.completionRate || "0%"}
                        color="bg-amber-500"
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 mb-8"
                >
                    <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                        Monthly Performance
                    </h2>
                    <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data?.habitPerformance || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 500 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={10}
                                />
                                <YAxis
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                    dx={-10}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                                        padding: '12px 20px',
                                        backgroundColor: '#1e293b',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Bar
                                    dataKey="monthlyCount"
                                    fill="#10b981"
                                    radius={[8, 8, 0, 0]}
                                    name="Completions"
                                    barSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}

function StatsCard({ icon: Icon, title, value, color }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-6 group hover:shadow-md transition-shadow"
        >
            <div className={`w-16 h-16 rounded-2xl ${color} flex items-center justify-center text-white shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                <Icon size={32} />
            </div>
            <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
                <p className="text-3xl font-black text-slate-900">{value}</p>
            </div>
        </motion.div>
    );
}
