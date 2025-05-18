import Head from 'next/head';
import Header from '@components/header';
import PostComponent from '@components/post';
import styles from '@styles/home.module.css';
import { useEffect, useState } from 'react';
import postService from '@services/PostService';
import { Community, Post } from '@types';
import communityService from '@services/CommunityService';
import { useRouter } from 'next/router';

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [communities, setCommunities] = useState<Community[]>([]);
    const router = useRouter();

    const fetchPosts = async () => {
        const response = await postService.getAllPosts();
        const postResponse = await response.json();
        setPosts(postResponse);
    };

    const fetchCommunities = async () => {
        const response = await communityService.getAllCommunities();
        const communityResponse = await response.json();
        setCommunities(communityResponse);
    }

    useEffect(() => {
        fetchPosts();
        fetchCommunities();
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
                                {communities.map((community) => (
                                    <li
                                        key={community.id}
                                        onClick={() => router.push(`/b/${community.id}`)}
                                    >
                                        b/{community.name.replaceAll(' ', '')}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <section className={styles.postsFeed}>
                        <div className={styles.postsList}>
                            {posts.map(post => (
                                <PostComponent key={post.id} post={post} />
                            ))}
                        </div>
                    </section>

                    <aside className={styles.rightSidebar}>
                        <div className={styles.aboutCard}>
                            <h3>About Bluedit</h3>
                            <p>Welcome to Setback, a Reddit-inspired platform for sharing and discussing content.</p>
                        </div>

                        {/*<div className={styles.trendingCard}>*/}
                        {/*    <h3>Trending Today</h3>*/}
                        {/*    <ol className={styles.trendingList}>*/}
                        {/*        <li>#NewMovieRelease</li>*/}
                        {/*        <li>#TechConference2023</li>*/}
                        {/*        <li>#ScienceDiscovery</li>*/}
                        {/*        <li>#GamingNews</li>*/}
                        {/*        <li>#AMA</li>*/}
                        {/*    </ol>*/}
                        {/*</div>*/}
                    </aside>
                </div>
            </main>
        </>
    );
};

export default Home;