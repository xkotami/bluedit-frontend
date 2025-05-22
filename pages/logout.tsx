import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import userService from '@services/UserService';
import { useUser } from '../hooks/useUser';

const Login: React.FC = () => {
    const [error, setError] = useState('');
    const [loggingOut, setLoggingOut] = useState<boolean>(false);
    const router = useRouter();
    const delay = (ms:  number) => new Promise(res => setTimeout(res, ms));
    const { userData, isUserLoading, userError } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            sessionStorage.clear();
            setLoggingOut(true);
            await delay(1000);
            await router.push('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <>
            <Head>
                <title>Bluedit | Log out</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            <main className={styles.mainContainer}>
                <div className={styles.content}>
                    {!userData ? (
                        <p>You are not logged in.</p>
                    ) : (
                        <>
                            {loggingOut ? (
                                <h1>Logging out...</h1>
                            ) : (
                                <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
                                    <h2 className="text-2xl font-bold mb-6 text-center">Are you sure you want to log
                                        out?</h2>
                                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                        onClick={handleSubmit}
                                    >
                                        Yes
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </>
    );
};

export default Login;