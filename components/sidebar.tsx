import Link from 'next/link';
import styles from '@styles/sidebar.module.css';

const SideBar: React.FC= ()=>{
    return(
        <main className={styles.sidebar}>
            <ul className='list'>
                <li> <Link href="/" >
                        Home
                    </Link></li>
                <li><Link href="/profile">
                        Profile
                    </Link></li>
                <li> <Link href='/community' >Community</Link></li>
                     
            </ul>
        </main>
    )
}

export default SideBar;


