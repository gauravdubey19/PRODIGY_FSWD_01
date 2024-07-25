import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Login from './Login'

const Profile = () => {
    const { user, logout } = useAuth();
    // console.log(user);

    if (!user) return <Login />

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col gap-8 items-center justify-center p-3">
            <h1 className="animate-slide-down text-6xl font-bold text-balance">Prodigy Auth - <span className='text-4xl'>MERN Stack</span></h1>
            <h1 className="animate-slide-down text-4xl font-bold">Profile</h1>
            {user && (
                <div className="animate-slide-up bg-gray-800 p-6 rounded-lg shadow-lg text-2xl text-blue-500 flex flex-col gap-3">
                    <p className="">Username : <span className='text-zinc-100 capitalize'>{user.username}</span></p>
                    <p className="">Email : <span className='text-zinc-100'>{user.email}</span></p>
                    <p className="">Role : <span className='text-zinc-100'>{user.role}</span></p>
                </div>
            )}
            <Link to="/login"
                onClick={logout}
                className="animate-slide-up bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
                Logout
            </Link>
        </div>
    );
};

export default Profile;
