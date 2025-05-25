import Link from 'next/link';
import styles from '@styles/header.module.css';
import { useUser } from '../hooks/useUser';
import React from 'react';
import { useRouter } from 'next/router';

const Header: React.FC = () => {
    const { userData } = useUser();
    const router = useRouter();

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
                        Home
                    </Link>
                    <Link href="/community" className={`${styles.link} ${isActive('/community') ? styles.active : ''}`}>
                        Community
                    </Link>
                    {userData ? (
                        <>
                            <Link href="/profile" className={`${styles.link} ${isActive('/profile') ? styles.active : ''}`}>
                                Profile
                            </Link>
                            <Link href="/logout" className={styles.link}>
                                Logout
                            </Link>
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