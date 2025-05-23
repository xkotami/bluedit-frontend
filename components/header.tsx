import Link from 'next/link';
import styles from '@styles/header.module.css';
import { useUser } from '../hooks/useUser';

const Header: React.FC = () => {
    const { userData, isUserLoading, userError } = useUser();

    return (
        <header className={styles.header}>
            <div>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.link}>
                        Home
                    </Link>
                    {userData ? (
                        <>
                            <Link href="/profile" className={styles.link}>
                                Profile
                            </Link>
                            <Link href="/logout" className={styles.link}>
                                Log out
                            </Link>
                        </>
                    ) : (
                        <Link href="/login" className={styles.link}>
                            Login
                        </Link>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
