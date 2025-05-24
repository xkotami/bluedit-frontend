import Head from 'next/head';
import Header from '@components/header';
import PostComponent from '@components/post';
import styles from '@styles/community.module.css';
import { useEffect, useState } from 'react';
import postService from '@services/PostService';
import { Community, Post } from '@types';
import communityService from '@services/CommunityService';
import { useRouter } from 'next/router';
import { useUser } from '../../hooks/useUser';

const CommunityPage: React.FC = () => {
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [isJoined, setIsJoined] = useState(false);
    const [postTitle, setPostTitle] = useState('');
    const [postDescription, setPostDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [joinLoading, setJoinLoading] = useState(false);
    const { userData, isUserLoading, userError } = useUser();
    const router = useRouter();
    const { id } = router.query;

    const fetchCommunityData = async () => {
        try {
            setLoading(true);
            const response = await communityService.getCommunityById(Number(id as string));
            const communityResponse = await response.json();
            setCommunity(communityResponse);
            setPosts(communityResponse.posts);
            console.log(communityResponse);
            setError('');
        } catch (err) {
            setError('Failed to load community');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!isNaN(Number(id as string))) {
            fetchCommunityData();
        }
    }, [id]);

    const handleJoinToggle = async () => {
        if (!userData) {
            router.push('/login');
            return;
        }

        setJoinLoading(true);
        try {
            // TODO: Implement actual join/leave functionality
            setIsJoined(!isJoined);
            setError('');
        } catch (error) {
            setError('Failed to update membership');
            console.error('Error toggling membership:', error);
        } finally {
            setJoinLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!postTitle.trim()) return;

        try {
            // const response = await postService.createPost({
            //     title: postTitle,
            //     content: postDescription,
            //     communityId: Number(id as string)
            // });
            // const newPost = await response.json();
            // setPosts([newPost, ...posts]);
            setPostTitle('');
            setPostDescription('');
        } catch (error) {
            console.error('Error creating post:', error);
        }
    };

    if (loading) {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <div className={styles.loading}>Loading community...</div>
                </div>
            </>
        );
    }

    if (!community) {
        return (
            <>
                <Header />
                <div className={styles.container}>
                    <div className={styles.error}>Community not found</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Bluedit | b/{community.name}</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />

            {error && (
                <div className={styles.error}>
                    {error}
                </div>
            )}

            <div className={styles.communityHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.communityInfo}>
                        <div className={styles.avatar}>
                            b/{community.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className={styles.communityTitle}>
                                b/{community.name.replaceAll(' ', '')}
                            </h1>
                            <div className={styles.communityStats}>
                                {community.users?.length || 0} members • {community.posts?.length || 0} posts
                            </div>
                        </div>
                    </div>
                    {userData && (
                        <button
                            className={`${styles.joinButton} ${isJoined ? styles.joined : ''}`}
                            onClick={handleJoinToggle}
                            disabled={joinLoading}
                        >
                            {joinLoading ? (isJoined ? 'Leaving...' : 'Joining...') : (isJoined ? 'Leave' : 'Join')}
                        </button>
                    )}
                </div>
            </div>

            <main className={styles.mainContainer}>
                <div className={styles.content}>
                    <section className={styles.postsFeed}>
                        <div className={styles.createPostCard}>
                            <div className={styles.postInputs}>
                                {userData ? (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Create a post"
                                            className={styles.createPostInput}
                                            value={postTitle}
                                            onChange={(e) => setPostTitle(e.target.value)}
                                        />
                                        <textarea
                                            placeholder="Text (optional)"
                                            className={styles.postDescriptionInput}
                                            value={postDescription}
                                            onChange={(e) => setPostDescription(e.target.value)}
                                            rows={3}
                                        />
                                    </>
                                ) : (
                                    <input
                                        type="text"
                                        placeholder="Log in to create posts"
                                        className={`${styles.createPostInput} ${styles.disabled}`}
                                        disabled
                                    />
                                )}
                            </div>
                            {userData && (
                                <button
                                    className={styles.postButton}
                                    onClick={handleCreatePost}
                                    disabled={!postTitle.trim()}
                                >
                                    Post
                                </button>
                            )}
                        </div>

                        <div className={styles.postsList}>
                            {posts.length > 0 ? (
                                posts.map(post => (
                                    <PostComponent key={post.id} post={post} />
                                ))
                            ) : (
                                <div className={styles.noPosts}>
                                    No posts yet. Be the first to post in this community!
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className={styles.sidebar}>
                        <div className={styles.aboutCard}>
                            <h3>About b/{community.name.replaceAll(' ', '')}</h3>
                            <p className={styles.communityDescription}>
                                {community.description || 'No description available.'}
                            </p>
                            <div className={styles.stats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{community.users?.length || 0}</span>
                                    <span className={styles.statLabel}>
                                        {(community.users?.length || 0) === 1 ? 'Member' : 'Members'}
                                    </span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{community.posts?.length || 0}</span>
                                    <span className={styles.statLabel}>
                                        {(community.posts?.length || 0) === 1 ? 'Post' : 'Posts'}
                                    </span>
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