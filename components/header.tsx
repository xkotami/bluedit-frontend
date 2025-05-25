import Link from 'next/link';
import styles from '@styles/header.module.css';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { clearAuthData, isAuthenticated } from '../service/userService';

const Header: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Check authentication status on component mount
        const checkAuth = () => {
            const authenticated = isAuthenticated();
            setIsLoggedIn(authenticated);

            if (authenticated) {
                const email = localStorage.getItem('userEmail');
                setUserEmail(email || '');
            }
        };

        checkAuth();

        // Optional: Listen for auth changes (if you implement an auth context)
        const handleStorageChange = () => {
            checkAuth();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Helper to check active route
    const isActive = (pathname: string) => router.pathname === pathname;

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/"><img src={"/images/logo.png"} alt={"logo"}/></Link>
                </div>
                <nav className={styles.nav}>
                    <Link href="/" className={`${styles.link} ${isActive('/') ? styles.active : ''}`}>
                        home
                    </Link>
                    <Link href="/community" className={`${styles.link} ${isActive('/community') ? styles.active : ''}`}>
                        Community
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link href="/profile" className={`${styles.link} ${isActive('/profile') ? styles.active : ''}`}>
                                Profile
                            </Link>
                            <button
                                className={`${styles.logout}`}
                                onClick={() => {
                                    // Clear all auth data from localStorage
                                    clearAuthData();

                                    // Update local state
                                    setIsLoggedIn(false);
                                    setUserEmail('');

                                    // Redirect to home page
                                    router.push('/');
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link href="/login" className={`${styles.link} ${styles.cta} ${isActive('/login') ? styles.active : ''}`}>
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;