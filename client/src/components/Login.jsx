import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        if (!emailPattern.test(email)) return setError('Please enter a valid email address.');
        setError('');
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (!passwordPattern.test(password)) {
            return setError('Please enter a valid password.');

        }
        setError('');
    };

    const handleSubmit = async (e) => {
        if (!email || !password) return setError('Email and Password are required.');
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Failed to log in. Please check your credentials.');
        }

    };

    return (
        <form
            onSubmit={handleSubmit}
            className="h-screen w-full p-6 bg-gray-950 flex flex-col gap-4 items-center justify-center"
        > <span className='animate-slide-down text-4xl text-white font-bold'>Sign In</span>
            <div className="animate-slide-up w-full flex flex-col gap-4 text-center bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-md mx-auto overflow-hidden">
                <input
                    type="text"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Email"
                    className="inputCss w-full"
                />
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                        className="inputCss w-full pr-10"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200 focus:outline-none"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {error && (
                    <div className="py-1 overflow-hidden">
                        <div className="animate-slide-up text-red-500">
                            {error}
                        </div>
                    </div>
                )}
                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition duration-300"
                >
                    Login
                </button>
                <Link
                    to="/register"
                    className="text-blue-400 hover:underline"
                >
                    New User?
                </Link>
            </div>
        </form>
    );
};

export default Login;
