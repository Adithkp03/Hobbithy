import { Loader2 } from 'lucide-react';

export function LoadingScreen({ message = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary-500" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
}
