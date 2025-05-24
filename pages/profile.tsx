import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/profile.module.css';
import { userService, postService, commentService, isAuthenticated } from 'service/apiService';

interface User {
    id?: number;
    username: string;
    email: string;
    points: number;
    password: string;
}

interface Post {
    id?: number;
    title: string;
    content: string;
    user: User;
    comments: Comment[];
    createdAt: Date;
}

interface Comment {
    id?: number;
    text: string;
    createdAt: Date;
    points: number;
    createdBy: User;
    parent?: Comment;
    replies: Comment[];
}

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [userComments, setUserComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('posts');
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) {
                router.push('/login');
                return;
            }

            // Load user details
            const userResult = await userService.getUserById(parseInt(userId));
            if (userResult.success && userResult.data) {
                setUser(userResult.data);
            } else {
                setError('Failed to load user profile');
                return;
            }

            // Load all posts and filter for current user
            const postsResult = await postService.getAllPosts();
            if (postsResult.success && postsResult.data) {
                const filteredPosts = postsResult.data.filter(
                    post => post.user.id === parseInt(userId)
                );
                setUserPosts(filteredPosts);
            }

            // Load user's comments
            const commentsResult = await commentService.getUserComments(parseInt(userId));
            if (commentsResult.success && commentsResult.data) {
                setUserComments(commentsResult.data);
            }

        } catch (err) {
            setError('Failed to load profile data');
            console.error('Profile loading error:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatNumber = (num: number): string => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toString();
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

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const renderTabContent = () => {
        if (activeTab === 'posts') {
            return (
                <div className={styles.postsContainer}>
                    {userPosts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            No posts yet. <a href="/posts/create">Create your first post!</a>
                        </div>
                    ) : (
                        userPosts.map(post => (
                            <div key={post.id} className={styles.post}>
                                <div className={styles.postHeader}>
                                    <span className={styles.subreddit}>r/community</span>
                                    <span className={styles.dot}>•</span>
                                    <span className={styles.time}>
                                        Posted by u/{user?.username} {formatTimeAgo(post.createdAt)}
                                    </span>
                                </div>
                                <h3 
                                    className={styles.postTitle}
                                    onClick={() => router.push(`/posts/${post.id}`)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {post.title}
                                </h3>
                                <p className={styles.postContent}>
                                    {post.content.length > 150 
                                        ? `${post.content.substring(0, 150)}...` 
                                        : post.content
                                    }
                                </p>
                                <div className={styles.postStats}>
                                    <span className={styles.upvotes}>▲ {post.comments?.length || 0}</span>
                                    <span className={styles.comments}>
                                        💬 {post.comments?.length || 0} comments
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            );
        } else if (activeTab === 'comments') {
            return (
                <div className={styles.postsContainer}>
                    {userComments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            No comments yet.
                        </div>
                    ) : (
                        userComments.map(comment => (
                            <div key={comment.id} className={styles.post}>
                                <div className={styles.postHeader}>
                                    <span className={styles.time}>
                                        Comment by u/{user?.username} {formatTimeAgo(comment.createdAt)}
                                    </span>
                                </div>
                                <p className={styles.postContent}>{comment.text}</p>
                                <div className={styles.postStats}>
                                    <span className={styles.upvotes}>▲ {comment.points}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            );
        } else {
            return (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    This feature is coming soon!
                </div>
            );
        }
    };

    if (loading) {
        return (
            <>
                <Head>
                    <title>Profile | Bluedit</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Header />
                <main className={styles.profileContainer}>
                    <div style={{ textAlign: 'center', padding: '60px', fontSize: '18px', color: '#666' }}>
                        Loading your profile...
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Head>
                    <title>Profile | Bluedit</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Header />
                <main className={styles.profileContainer}>
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px', 
                        fontSize: '18px', 
                        color: '#d32f2f',
                        backgroundColor: '#ffebee',
                        borderRadius: '8px',
                        margin: '20px'
                    }}>
                        {error}
                    </div>
                </main>
            </>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <>
            <Head>
                <title>{user.username} | Bluedit Profile</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />

            <main className={styles.profileContainer}>
                <div className={styles.profileHeader}>
                    <div className={styles.banner}></div>
                    <div className={styles.profileInfo}>
                        <div className={styles.avatarContainer}>
                            <div className={styles.avatar}></div>
                            <h1 className={styles.username}>u/{user.username}</h1>
                        </div>
                        <div className={styles.stats}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{formatNumber(user.points)}</span>
                                <span className={styles.statLabel}>Reputation</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>Member</span>
                                <span className={styles.statLabel}>Status</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{userPosts.length}</span>
                                <span className={styles.statLabel}>Posts</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{userComments.length}</span>
                                <span className={styles.statLabel}>Comments</span>
                            </div>
                        </div>
                        <div className={styles.about}>
                            <h3>About</h3>
                            <p>Active community member on Bluedit</p>
                        </div>
                        {/* Removed follow button since this is the user's own profile */}
                    </div>
                </div>

                <div className={styles.tabs}>
                    <button 
                        className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
                        onClick={() => handleTabClick('posts')}
                    >
                        Posts ({userPosts.length})
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'comments' ? styles.active : ''}`}
                        onClick={() => handleTabClick('comments')}
                    >
                        Comments ({userComments.length})
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'saved' ? styles.active : ''}`}
                        onClick={() => handleTabClick('saved')}
                    >
                        Saved
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'upvoted' ? styles.active : ''}`}
                        onClick={() => handleTabClick('upvoted')}
                    >
                        Upvoted
                    </button>
                    <button 
                        className={`${styles.tab} ${activeTab === 'downvoted' ? styles.active : ''}`}
                        onClick={() => handleTabClick('downvoted')}
                    >
                        Downvoted
                    </button>
                </div>

                {renderTabContent()}
            </main>
        </>
    );
};

export default Profile;