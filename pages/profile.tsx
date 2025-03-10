import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/home.module.css';


const Profile: React.FC = () => {
    return (
        <>
            <Head>
                <title>Setback | Profile</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            <main className={styles.main}>
                <span>
                    <h1>Setback</h1>
                </span>

                <div className={styles.description}>
                    <p>Welcome to the Setback platform.</p>
                </div>
            </main>
        </>
    )
}

export default Profile;