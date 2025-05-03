import Head from 'next/head';
import Header from '@components/header';
import PostComponent from '@components/post';
import styles from '@styles/home.module.css';
import { useEffect, useState } from 'react';
import postService from '@services/PostService';
import { Post } from '@types';

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        const response = await postService.getAllPosts();
        const postResponse = await response.json();
        setPosts(postResponse);
        console.log(posts);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <>
            <Head>
                <title>Setback | Home</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            <main className={styles.mainContainer}>
                <div className={styles.content}>
                    <aside className={styles.leftSidebar}>
                        <div className={styles.communitiesSection}>
                            <h3>Top Communities</h3>
                            <ul className={styles.communityList}>
                                <li>r/AskReddit</li>
                                <li>r/WorldNews</li>
                                <li>r/Technology</li>
                                <li>r/Gaming</li>
                                <li>r/Movies</li>
                            </ul>
                        </div>
                    </aside>

                    <section className={styles.postsFeed}>
                        <div className={styles.createPostCard}>
                            <div className={styles.userAvatar}>
                                <span>👤</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Create Post"
                                className={styles.createPostInput}
                            />
                            <button className={styles.mediaButton}>📷</button>
                        </div>

                        <div className={styles.postsList}>
                            {posts.map(post => (
                                <PostComponent key={post.id} post={post} />
                            ))}
                        </div>
                    </section>

                    <aside className={styles.rightSidebar}>
                        <div className={styles.aboutCard}>
                            <h3>About Setback</h3>
                            <p>Welcome to Setback, a Reddit-inspired platform for sharing and discussing content.</p>
                            <button className={styles.joinButton}>Join</button>
                        </div>

                        <div className={styles.trendingCard}>
                            <h3>Trending Today</h3>
                            <ol className={styles.trendingList}>
                                <li>#NewMovieRelease</li>
                                <li>#TechConference2023</li>
                                <li>#ScienceDiscovery</li>
                                <li>#GamingNews</li>
                                <li>#AMA</li>
                            </ol>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
};

export default Home;