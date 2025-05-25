import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import loginStyles from '@styles/login.module.css';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import userService from '@services/UserService';
import { useUser } from '../hooks/useUser';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { userData, isUserLoading, userError } = useUser();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

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
        } finally {
            setLoading(false);
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
                        <div className={loginStyles.alreadyLoggedIn}>
                            <p>You are already logged in.</p>
                        </div>
                    ) : (
                        <div className={loginStyles.loginContainer}>
                            <h2 className={loginStyles.loginTitle}>Welcome Back</h2>
                            {error && <div className={loginStyles.error}>{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className={loginStyles.formGroup}>
                                    <label htmlFor="email" className={loginStyles.label}>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={loginStyles.input}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className={loginStyles.formGroup}>
                                    <label htmlFor="password" className={loginStyles.label}>
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={loginStyles.input}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={loginStyles.submitButton}
                                >
                                    {loading ? (
                                        <span className={loginStyles.loadingSpinner}>
                                            <span className={loginStyles.spinner}></span>
                                            Signing in...
                                        </span>
                                    ) : 'Login'}
                                </button>
                            </form>
                            <div className={loginStyles.linkContainer}>
                                <p>
                                    Don't have an account?{' '}
                                    <a href="/signup" className={loginStyles.link}>
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