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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    const fetchPosts = async () => {
        try {
            const response = await postService.getAllPosts();
            const postResponse = await response.json();
            // Sort posts by creation time (newest first)
            const sortedPosts = postResponse.sort((a: Post, b: Post) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setPosts(sortedPosts);
        } catch (err) {
            setError('Failed to load posts');
            console.error('Error loading posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCommunities = async () => {
        const response = await communityService.getAllCommunities();
        const communityResponse = await response.json();
        setCommunities(communityResponse);
    };

    const formatTimeAgo = (date: Date | string): string => {
        const now = new Date();
        const postDate = new Date(date);
        const diffInMs = now.getTime() - postDate.getTime();
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInHours < 1) {
            return 'Less than an hour ago';
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInDays < 7) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else {
            return postDate.toLocaleDateString();
        }
    };

    const truncateContent = (content: string, maxLength: number = 200): string => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    const handlePostClick = (postId: number) => {
        router.push(`/posts/${postId}`);
    };

    useEffect(() => {
        fetchPosts();
        fetchCommunities();
    }, []);

    return (
        <>
            <Head>
                <title>Bluedit | Home</title>
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
                        {loading && (
                            <div className={styles.loadingState}>
                                Loading posts...
                            </div>
                        )}

                        {error && (
                            <div className={styles.errorState}>
                                {error}
                            </div>
                        )}

                        {!loading && !error && (
                            <div className={styles.feedContainer}>
                                {posts.length === 0 ? (
                                    <div className={styles.emptyState}>
                                        <h3>No posts yet!</h3>
                                        <p>Be the first to share something with the community.</p>
                                        <button
                                            className={styles.createPostButton}
                                            onClick={() => router.push('/posts/create')}
                                        >
                                            Create First Post
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className={styles.postsList}>
                                            {posts.map((post) => (
                                                <div
                                                    key={post.id}
                                                    className={styles.postCard}
                                                    onClick={() => handlePostClick(post.id!)}
                                                >
                                                    <div className={styles.postHeader}>
                                                        <span className={styles.community}>r/community</span>
                                                        <span className={styles.dot}>•</span>
                                                        <span>Posted by </span>
                                                        <span className={styles.author}>u/{post.user?.username || 'Anonymous'}</span>
                                                        <span className={styles.points}>({post.user?.points || 0} pts)</span>
                                                        <span className={styles.dot}>•</span>
                                                        <span>{formatTimeAgo(post.createdAt)}</span>
                                                    </div>

                                                    <h3 className={styles.postTitle}>
                                                        {post.title}
                                                    </h3>

                                                    {post.content && (
                                                        <p className={styles.postContent}>
                                                            {truncateContent(post.content)}
                                                        </p>
                                                    )}

                                                    <div className={styles.postStats}>
                                                        <div className={styles.stat}>
                                                        <span>▲</span>
                                                            <span>{post.comments?.length || 0}</span>
                                                        </div>
                                                        <div className={styles.stat}>
                                                            <span>💬</span>
                                                            <span>{post.comments?.length || 0} comments</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className={styles.createPostFooter}>
                                            <button
                                                className={styles.createPostButton}
                                                onClick={() => router.push('/posts/create')}
                                            >
                                                Create New Post
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </section>

                    <aside className={styles.rightSidebar}>
                        <div className={styles.aboutCard}>
                            <h3>About Bluedit</h3>
                            <p>Welcome to Bluedit, a Reddit-inspired platform for sharing and discussing content.</p>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
};

export default Home;