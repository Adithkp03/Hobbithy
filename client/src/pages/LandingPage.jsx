import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    RefreshCcw,
    Heart,
    Zap,
    CheckCircle2,
    XCircle,
    Trophy,
    ArrowUpRight,
    Sparkles
} from 'lucide-react';
import logo from '../assets/logo.jpg';
import ThemeToggle from '../components/ThemeToggle';

// --- SEO & UI Optimized Components ---

const Navbar = () => {
    const navigate = useNavigate();
    return (
        <nav className="fixed top-0 w-full z-[60] bg-stone-50/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-stone-200/40 dark:border-slate-800 transition-colors duration-300 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-2 group cursor-pointer" aria-label="Hobbithy Home">
                    <img src={logo} alt="Hobbithy" className="w-10 h-10 rounded-lg object-cover shadow-sm dark:shadow-emerald-900/20 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="text-2xl font-black tracking-tighter text-stone-800 dark:text-white">hobbithy</span>
                </div>

                <div className="hidden lg:flex items-center gap-10 text-sm font-semibold text-stone-500 dark:text-slate-400">
                    <a href="#philosophy" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Habit Recovery</a>
                    <a href="#simulator" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Resilience Simulator</a>
                    <a href="#comparison" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">The Difference</a>
                </div>

                <div className="flex items-center gap-5">
                    <ThemeToggle />
                    <button onClick={() => navigate('/login')} className="text-sm font-bold text-stone-600 dark:text-slate-300 hover:text-stone-900 dark:hover:text-white transition-colors">Sign In</button>
                    <button onClick={() => navigate('/register')} className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-stone-500/20 dark:shadow-none active:scale-95">
                        Get Started
                    </button>
                </div>
            </div>
        </nav>
    );
};

const Hero = () => {
    const navigate = useNavigate();
    return (
        <header className="relative pt-32 pb-24 md:pt-52 md:pb-40 overflow-hidden bg-stone-50 dark:bg-slate-900 transition-colors duration-300">
            {/* Refined Mesh Gradient Background */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-60">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-100 rounded-full blur-[120px]" />
                <div className="absolute bottom-[0%] right-[-10%] w-[50%] h-[50%] bg-amber-100 rounded-full blur-[100px]" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-50 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 text-stone-600 text-[11px] font-bold uppercase tracking-[0.2em] mb-8 shadow-sm">
                    <Sparkles className="w-3 h-3 text-emerald-500" />
                    The World's First Resilient Habit Tracker
                </div>

                <h1 className="text-6xl md:text-8xl font-serif text-stone-900 dark:text-slate-50 leading-[0.95] mb-10 max-w-5xl mx-auto tracking-tight">
                    Build habits that <br />
                    <span className="text-emerald-700 italic font-medium relative">
                        actually survive
                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 15C50 5 150 5 295 15" stroke="#10b981" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
                        </svg>
                    </span>
                    &nbsp; your bad days.
                </h1>

                <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto mb-12 leading-relaxed font-serif italic font-light">
                    Ditch the "Day 0" anxiety. Hobbithy uses <strong className="font-bold text-stone-800 dark:text-stone-100 not-italic">Adaptive Goal Technology</strong> to help you maintain consistency through life’s inevitable ups and downs.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    <button onClick={() => navigate('/register')} className="w-full sm:w-auto bg-emerald-600 text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-emerald-700 hover:shadow-2xl hover:shadow-emerald-200 dark:hover:shadow-emerald-900/30 transition-all flex items-center justify-center gap-3 group">
                        Join the Resilient 1%
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </header>
    );
};

const ResilienceSimulator = () => {
    const [dayType, setDayType] = useState('normal');

    const scenarios = {
        normal: { label: 'Normal Day', target: '45 mins Gym', score: '100%', color: 'bg-emerald-500', note: "Standard goal met." },
        busy: { label: 'Busy/Tired', target: '10 mins Walk', score: 'Partial Credit', color: 'bg-emerald-300', note: "Maintenance mode active." },
        sick: { label: 'Sick/Emergency', target: 'Rest & Recover', score: 'Resilience Bonus', color: 'bg-amber-400', note: "Health priority recognized." }
    };

    return (
        <section id="simulator" className="py-24 bg-white dark:bg-slate-900 px-6 scroll-mt-20">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
                            See the <span className="text-emerald-600 italic">Adaptive</span> difference.
                        </h2>
                        <p className="text-stone-600 text-lg leading-relaxed">
                            In traditional apps, "Busy" or "Sick" days mean a broken streak. In Hobbithy, they are opportunities to earn <strong>Resilience Points</strong>. Toggle the buttons below to see how our algorithms adjust your daily targets.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            {Object.keys(scenarios).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setDayType(type)}
                                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 transform active:scale-95 ${dayType === type ? 'bg-stone-900 text-white shadow-xl dark:shadow-slate-700/50 translate-y-[-2px]' : 'bg-stone-100 dark:bg-slate-800 text-stone-500 dark:text-slate-400 hover:bg-stone-200 dark:hover:bg-slate-700'
                                        }`}
                                    aria-pressed={dayType === type}
                                >
                                    {scenarios[type].label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="relative p-1 bg-stone-50 dark:bg-slate-800 rounded-[3rem] border border-stone-200 dark:border-slate-700 shadow-2xl dark:shadow-slate-900/50 transition-all duration-500">
                        <div className="bg-white dark:bg-slate-900 rounded-[2.8rem] p-10 space-y-8">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 dark:text-slate-500 mb-2">Adaptive Goal Engine</p>
                                    <p className="text-3xl font-bold text-stone-900 dark:text-white transition-all duration-300">{scenarios[dayType].target}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-xs font-black transition-colors duration-500 ${scenarios[dayType].color} text-white`}>
                                    {scenarios[dayType].score}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="h-4 bg-stone-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all duration-700 ease-out ${scenarios[dayType].color}`}
                                        style={{ width: dayType === 'normal' ? '100%' : dayType === 'busy' ? '40%' : '15%' }}
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-widest">
                                    <span>Progress Velocity</span>
                                    <span>{scenarios[dayType].note}</span>
                                </div>
                            </div>

                            <div className="bg-emerald-50 dark:bg-emerald-900/10 p-5 rounded-2xl flex gap-4 items-center border border-emerald-100 dark:border-emerald-900/30">
                                <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm">
                                    <Trophy className="w-5 h-5 text-emerald-600" />
                                </div>
                                <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                                    {dayType === 'sick'
                                        ? "Great job prioritizing health. Your resilience score increased!"
                                        : "Consistency maintained. You're building lasting momentum through flexibility."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeatureCard = ({ icon: Icon, title, description, badge }) => (
    <article className="bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] border border-stone-100 dark:border-slate-700 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgb(0,0,0,0.08)] dark:shadow-none dark:hover:shadow-[0_20px_50px_rgb(16,185,129,0.05)] transition-all duration-500 group hover:-translate-y-2">
        <div className="flex justify-between items-start mb-8">
            <div className="w-14 h-14 bg-stone-50 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-stone-800 dark:text-slate-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-inner">
                <Icon className="w-7 h-7" aria-hidden="true" />
            </div>
            {badge && <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full uppercase tracking-tighter">{badge}</span>}
        </div>
        <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-4">{title}</h3>
        <p className="text-stone-500 dark:text-slate-400 leading-relaxed font-medium">{description}</p>
        <div className="mt-8 flex items-center gap-2 text-emerald-600 font-bold text-sm cursor-pointer group/link">
            Learn about the science <ArrowUpRight className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
        </div>
    </article>
);

const TrustSection = () => (
    <section className="py-20 bg-stone-50 border-y border-stone-200/50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 mb-10">Optimized for humans who value progress over perfection</h2>
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
                {['ProductHunt', 'Wired', 'TheVerge', 'Mindful', 'PsychologyToday'].map(brand => (
                    <span key={brand} className="text-2xl font-serif font-bold text-stone-900 cursor-default">{brand}</span>
                ))}
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer className="py-20 bg-stone-900 text-stone-400 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-2 space-y-6">
                <div className="flex items-center gap-2">
                    <img src={logo} alt="Hobbithy" className="w-8 h-8 rounded-lg object-cover" />
                    <span className="text-2xl font-bold text-white tracking-tighter">hobbithy</span>
                </div>
                <p className="max-w-xs text-stone-500 leading-relaxed">
                    The habit recovery app for the rest of us. Built to help you bounce back faster and build consistency through kindness, not pressure.
                </p>
            </div>
            <div className="space-y-4">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">System</h4>
                <ul className="space-y-2 text-sm">
                    <li><a href="#simulator" className="hover:text-emerald-400 transition-colors">Adaptive Goals</a></li>
                    <li><a href="#" className="hover:text-emerald-400 transition-colors">Recovery Metrics</a></li>
                    <li><a href="#" className="hover:text-emerald-400 transition-colors">Scientific Basis</a></li>
                </ul>
            </div>
            <div className="space-y-4">
                <h4 className="text-white font-bold text-sm uppercase tracking-widest">Resources</h4>
                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:text-emerald-400 transition-colors">Mindful Productivity</a></li>
                    <li><a href="#" className="hover:text-emerald-400 transition-colors">Privacy Ethics</a></li>
                    <li><a href="#" className="hover:text-emerald-400 transition-colors">Support</a></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-stone-800 flex flex-col md:flex-row justify-between gap-4 text-xs font-bold tracking-widest uppercase">
            <p>© 2026 Hobbithy Inc. All rights reserved. Designed with empathy.</p>
            <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
        </div>
    </footer>
);

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-emerald-100 selection:text-emerald-900 scroll-smooth">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,700;1,9..144,300;1,9..144,400&display=swap');
        
        body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        .font-serif { font-family: 'Fraunces', serif; }
        
        .bg-grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          opacity: 0.03;
        }
      `}</style>

            {/* Subtle Grain Overlay for Premium Texture */}
            <div className="fixed inset-0 pointer-events-none bg-grain z-[100]" />

            <Navbar />

            <main>
                <Hero />

                <TrustSection />

                <section id="philosophy" className="py-32 bg-white dark:bg-slate-900 px-6 scroll-mt-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-6xl font-serif text-stone-900 dark:text-white mb-6 tracking-tight">Built for <span className="text-emerald-600 dark:text-emerald-400 italic">Growth</span>, not Guilt.</h2>
                            <p className="text-stone-500 dark:text-slate-400 text-xl max-w-2xl mx-auto font-medium">Hobbithy is the first habit-forming platform that treats you like a human, valuing your <strong>resilience</strong> as much as your consistency.</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10">
                            <FeatureCard
                                icon={RefreshCcw}
                                title="Flexible Habit Logic"
                                description="Most apps are 1 or 0. Hobbithy allows for Partial wins, meaning you stay on track even when you only have 5 minutes to spare."
                                badge="Adaptive AI"
                            />
                            <FeatureCard
                                icon={Heart}
                                title="Burnout Prevention"
                                description="Our system detects signs of fatigue and automatically suggests 'Low Energy' targets—rewarding you for listening to your needs."
                                badge="Neuro-Inclusive"
                            />
                            <FeatureCard
                                icon={Zap}
                                title="Bounce-Back Metrics"
                                description="Stop tracking streaks. Start tracking how fast you recover from a missed day. That's the real skill of a habit master."
                            />
                        </div>
                    </div>
                </section>

                <ResilienceSimulator />

                <section id="comparison" className="py-32 bg-stone-900 text-white rounded-[4rem] mx-4 my-20 px-6 scroll-mt-20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-32 opacity-10 pointer-events-none">
                        <RefreshCcw className="w-96 h-96 animate-spin-slow" />
                    </div>

                    <div className="max-w-5xl mx-auto text-center space-y-12 relative z-10">
                        <h2 className="text-4xl md:text-6xl font-serif leading-tight tracking-tight">The last habit tracker <br /> you'll ever need.</h2>
                        <p className="text-stone-400 text-xl max-w-2xl mx-auto font-light">Because it's the first one that doesn't expect you to be a machine. Build a better life through sustainable, non-linear growth.</p>

                        <div className="grid md:grid-cols-2 gap-px bg-stone-800 rounded-3xl overflow-hidden border border-stone-800 shadow-2xl mt-16">
                            <div className="p-16 bg-stone-900 text-left space-y-6">
                                <span className="text-xs font-black uppercase tracking-widest text-red-500">Streak-Based Apps</span>
                                <ul className="space-y-4">
                                    {['Linear progress only', 'Guilt as a motivator', 'Static, rigid goals', 'High abandonment rate'].map(txt => (
                                        <li key={txt} className="flex gap-4 text-stone-500 font-bold"><XCircle className="w-5 h-5 text-red-900 shrink-0" /> {txt}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-16 bg-stone-800 text-left space-y-6 border-l border-stone-700">
                                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Hobbithy Journey</span>
                                <ul className="space-y-4">
                                    {['Adaptive recovery loops', 'Compassion-based tracking', 'Resilience scoring', 'Sustainable life-long growth'].map(txt => (
                                        <li key={txt} className="flex gap-4 text-white font-bold"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" /> {txt}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="pt-10">
                            <button onClick={() => navigate('/register')} className="bg-white text-stone-900 px-12 py-5 rounded-full text-xl font-black hover:bg-emerald-400 hover:text-stone-900 transition-all shadow-xl shadow-stone-950 active:scale-95">
                                Start Your Recovery Journey
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
      `}</style>
        </div>
    );
}
