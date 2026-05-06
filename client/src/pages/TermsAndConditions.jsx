import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsAndConditions() {
    const navigate = useNavigate();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.iubenda.com/iubenda.js';
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="min-h-screen bg-stone-50 dark:bg-slate-950 text-stone-900 dark:text-white transition-colors duration-300">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,700;1,9..144,300;1,9..144,400&display=swap');
                body { font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
                .font-serif { font-family: 'Fraunces', serif; }
            `}</style>

            <nav className="sticky top-0 z-50 bg-stone-50/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-stone-200/40 dark:border-slate-800 px-6 py-4">
                <div className="max-w-4xl mx-auto flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-sm font-bold text-stone-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <span className="text-stone-300 dark:text-slate-700">|</span>
                    <h1 className="text-sm font-bold text-stone-800 dark:text-white">Terms and Conditions</h1>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-stone-200 dark:border-slate-800 p-8 md:p-12 shadow-sm">
                    <a
                        href="https://www.iubenda.com/terms-and-conditions/73739296"
                        className="iubenda-white iubenda-noiframe iubenda-embed iub-body-embed"
                        title="Terms and Conditions"
                    >
                        Terms and Conditions
                    </a>
                </div>
            </main>
        </div>
    );
}
