import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Input({ className, label, error, ...props }) {
    return (
        <div className="w-full">
            {label && (
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    {label}
                </label>
            )}
            <input
                className={twMerge(
                    "block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm transition-colors",
                    error && "border-red-500 focus:border-red-500 focus:ring-red-500",
                    className
                )}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
}
