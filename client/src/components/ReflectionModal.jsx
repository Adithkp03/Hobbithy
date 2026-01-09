import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Check } from 'lucide-react';

export function ReflectionModal({ isOpen, onClose, onSubmit }) {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({
        hardestHabit: '',
        biggestBlocker: '',
        whatWorked: ''
    });

    if (!isOpen) return null;

    const questions = [
        {
            key: 'hardestHabit',
            title: "Which habit was hardest this week?",
            placeholder: "e.g., Waking up early because..."
        },
        {
            key: 'biggestBlocker',
            title: "What was your biggest blocker?",
            placeholder: "e.g., Phone distractions, tiredness..."
        },
        {
            key: 'whatWorked',
            title: "What worked well?",
            placeholder: "e.g., Putting phone away, prepping clothes..."
        }
    ];

    const handleNext = () => {
        if (step < questions.length - 1) {
            setStep(step + 1);
        } else {
            onSubmit(answers);
        }
    };

    const currentQ = questions[step];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 text-white flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold">Weekly Check-in</h2>
                            <p className="text-emerald-50 opacity-90 text-sm mt-1">
                                Pause. Reflect. Reset.
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/70 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-8">
                        <div className="mb-6">
                            <span className="text-xs font-bold text-emerald-500 tracking-wider uppercase">
                                Question {step + 1} of {questions.length}
                            </span>
                            <h3 className="text-xl font-semibold text-slate-800 mt-2">
                                {currentQ.title}
                            </h3>
                        </div>

                        <textarea
                            value={answers[currentQ.key]}
                            onChange={(e) => setAnswers({ ...answers, [currentQ.key]: e.target.value })}
                            placeholder={currentQ.placeholder}
                            className="w-full h-32 p-4 text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none transition-all"
                            autoFocus
                        />

                        {/* Footer Controls */}
                        <div className="mt-8 flex justify-between items-center">
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-600 text-sm font-medium px-2 py-1"
                            >
                                Skip for now
                            </button>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleNext}
                                disabled={!answers[currentQ.key].trim()}
                                className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium flex items-center shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {step === questions.length - 1 ? (
                                    <>Complete <Check size={18} className="ml-2" /></>
                                ) : (
                                    <>Next <ChevronRight size={18} className="ml-2" /></>
                                )}
                            </motion.button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-slate-100 w-full">
                        <div
                            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
                            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                        />
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
