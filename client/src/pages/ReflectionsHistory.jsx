import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import API from '../api/axios';

export default function ReflectionsHistory() {
    const [reflections, setReflections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReflections = async () => {
            try {
                const res = await API.get('/reflections');
                setReflections(res.data);
            } catch (error) {
                console.error('Failed to fetch reflections', error);
            } finally {
                setLoading(false);
            }
        };
        fetchReflections();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-primary-600 font-medium">Loading history...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center space-x-4">
                    <Link to="/dashboard" className="p-2 hover:bg-white rounded-full transition-colors text-slate-500 hover:text-primary-600">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-slate-900">Reflection History</h1>
                </div>

                {reflections.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200">
                        <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No reflections yet</h3>
                        <p className="text-slate-500 mt-1">Complete your first weekly check-in to see it here.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {reflections.map((reflection) => (
                            <motion.div
                                key={reflection._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
                            >
                                <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-slate-600">
                                        <Calendar size={18} />
                                        <span className="font-medium">
                                            Week of {format(new Date(reflection.weekStartDate), 'MMM d, yyyy')}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-400">
                                        Submitted {format(new Date(reflection.createdAt), 'MMM d')}
                                    </span>
                                </div>
                                <div className="p-6 space-y-4">
                                    <AnswerSection title="Hardest Habit" content={reflection.answers.hardestHabit} />
                                    <AnswerSection title="Biggest Blocker" content={reflection.answers.biggestBlocker} />
                                    <AnswerSection title="What Worked" content={reflection.answers.whatWorked} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function AnswerSection({ title, content }) {
    return (
        <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</h4>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
    );
}
