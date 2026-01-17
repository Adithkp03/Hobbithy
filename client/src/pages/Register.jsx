import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300 px-4 py-12 sm:px-6 lg:px-8 relative">
            <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors font-medium">
                <ArrowLeft size={20} />
                Back to Home
            </Link>
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white dark:bg-slate-800 p-8 shadow-xl dark:shadow-slate-900/50 transition-colors duration-300">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
                        Or{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                            sign in to your existing account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Username"
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Input
                            label="Email address"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <Button type="submit" className="w-full">
                            Register
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
