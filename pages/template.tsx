import React from 'react';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import Head from 'next/head';

const Template: React.FC = () => {

    return (
        <>
            <Head>
                <title>Template | SteamList</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            <main className={styles.main}>
                <p>Test</p>
            </main>
        </>
    );
};

export default Template;