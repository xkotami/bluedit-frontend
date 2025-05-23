import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@styles/header.module.css';
import { clearAuthData, isAuthenticated } from 'service/userService';


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

    const logout = () => {
        // Clear all auth data from localStorage
        clearAuthData();
        
        // Update local state
        setIsLoggedIn(false);
        setUserEmail('');
        
        // Redirect to home page
        router.push('/');
    };

    return (
        <header className={styles.header}>
            <div>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.link}>
                        Home
                    </Link>
                    
                    {isLoggedIn ? (
                        <>
                            <Link href="/community" className={styles.link}>
                                Communities
                            </Link>
                            <Link href="/posts/create" className={styles.link}>
                                Create Post
                            </Link>
                            <Link href="/profile" className={styles.link}>
                                Profile
                            </Link>
                            <span className={styles.userInfo}>
                                {userEmail}
                            </span>
                            <button 
                                className={styles.logoutButton} 
                                onClick={logout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/communities" className={styles.link}>
                                Communities
                            </Link>
                            <Link href="/login" className={styles.link}>
                                Login
                            </Link>
                            <Link href="/signup" className={styles.link}>
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;