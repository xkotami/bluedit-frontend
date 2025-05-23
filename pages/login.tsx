import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import userService from '@services/UserService';
import { useUser } from '../hooks/useUser';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const { userData, isUserLoading, userError } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const response = await userService.login({ email, password });
            const user = await response.json();
            if (user.message === "ERROR_USER_NOT_FOUND") {
                setError('Incorrect email or password.');
            }
            else {
                sessionStorage.setItem('user', JSON.stringify(user));
                await router.push('/');
            }
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <>
            <Head>
                <title>Bluedit | Login</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            <main className={styles.mainContainer}>
                <div className={styles.content}>
                    {userData ? (
                        <p>You are already logged in.</p>
                    ) : (
                        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                            <h2 className="text-2xl font-bold mb-6 text-center">Login to Bluedit</h2>
                            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-6">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    Login
                                </button>
                            </form>
                            <div className="mt-4 text-center">
                                <p className="text-sm text-gray-600">
                                    Don't have an account?{' '}
                                    <a href="/register" className="text-blue-500 hover:underline">
                                        Register
                                    </a>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default Login;