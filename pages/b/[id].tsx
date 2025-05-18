import Head from 'next/head';
import Header from '@components/header';
import PostComponent from '@components/post';
import styles from '@styles/community.module.css';
import { useEffect, useState } from 'react';
import postService from '@services/PostService';
import { Community, Post } from '@types';
import communityService from '@services/CommunityService';
import { useRouter } from 'next/router';

const CommunityPage: React.FC = () => {
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isJoined, setIsJoined] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    const fetchCommunityData = async () => {
        const response = await communityService.getCommunityById(Number(id as string));
        const communityResponse = await response.json();
        setCommunity(communityResponse);
        setPosts(communityResponse.posts);
        console.log(communityResponse);
    };

    useEffect(() => {
        if (!isNaN(Number(id as string))) {
            fetchCommunityData();
        }
    }, [id]);

    const handleJoinToggle = () => {
        setIsJoined(!isJoined);
        // TODO: add join functionality
    };

    if (!community) return <div>Loading...</div>;

    return (
        <>
            <Head>
                <title>Bluedit | b/{community.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            <div className={styles.communityHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.communityInfo}>
                        <div className={styles.avatar}>b/{community.name.charAt(0).toUpperCase()}</div>
                        <h1>b/{community.name}</h1>
                    </div>
                    <button
                        className={`${styles.joinButton} ${isJoined ? styles.joined : ''}`}
                        onClick={handleJoinToggle}
                    >
                        {isJoined ? 'Joined' : 'Join'}
                    </button>
                </div>
            </div>
            <main className={styles.mainContainer}>
                <div className={styles.content}>
                    <section className={styles.postsFeed}>
                        <div className={styles.createPostCard}>
                            <div className={styles.userAvatar}>
                                <span>👤</span>
                            </div>
                            <input
                                type="text"
                                placeholder={`Create a post in b/${community.name}`}
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

                    <aside className={styles.sidebar}>
                        <div className={styles.aboutCard}>
                            <h3>About Community</h3>
                            <p>{community.description || 'No description available.'}</p>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{community.users.length || 0}</span>
                                    <span
                                        className={styles.statLabel}>{community.users.length == 1 ? "Member" : "Members"}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{community.posts.length || 0}</span>
                                    <span
                                        className={styles.statLabel}>{community.posts.length == 1 ? "Post" : "Posts"}</span>
                                </div>
                            </div>
                            <div className={styles.createdDate}>
                                Created {new Date(community.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
};

export default CommunityPage;