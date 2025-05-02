import Link from 'next/link';
import styles from '@styles/header.module.css';

const Header: React.FC = () => {
    return (
        <header className={styles.header}>
            <div>
                <nav className={styles.nav}>
                    <Link href="/" className={styles.link}>
                        Home
                    </Link>
                    <Link href="/profile" className={styles.link}>
                        Profile
                    </Link>
                    <Link href='/community' className={styles.link}>Community</Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
