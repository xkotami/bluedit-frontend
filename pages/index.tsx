import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/home.module.css';
import { isAuthenticated, postService } from 'service/apiService';


interface User {
    id?: number;
    username: string;
    email: string;
    points: number;
    password: string;
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

interface Post {
    id?: number;
    title: string;
    content: string;
    user: User;
    comments: Comment[];
    createdAt: Date;
}

const Home: React.FC = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            const result = await postService.getAllPosts();
            if (result.success && result.data) {
                // Sort posts by creation time (newest first)
                const sortedPosts = result.data.sort((a, b) => 
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setPosts(sortedPosts);
            } else {
                setError('Failed to load posts');
            }
        } catch (err) {
            setError('Failed to load posts');
            console.error('Error loading posts:', err);
        } finally {
            setLoading(false);
        }
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

    const feedContainerStyle: React.CSSProperties = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0 20px'
    };

    const postCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        border: '1px solid #e1e1e1',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.2s ease, transform 0.1s ease',
        cursor: 'pointer'
    };

    const postCardHoverStyle: React.CSSProperties = {
        boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
        transform: 'translateY(-1px)'
    };

    const postHeaderStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        fontSize: '14px',
        color: '#666'
    };

    const communityStyle: React.CSSProperties = {
        color: '#007bff',
        fontWeight: '600',
        textDecoration: 'none'
    };

    const authorStyle: React.CSSProperties = {
        color: '#333',
        fontWeight: '500'
    };

    const pointsStyle: React.CSSProperties = {
        color: '#28a745',
        fontSize: '12px',
        marginLeft: '4px'
    };

    const dotStyle: React.CSSProperties = {
        margin: '0 8px',
        color: '#ccc'
    };

    const postTitleStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '12px',
        lineHeight: '1.3'
    };

    const postContentStyle: React.CSSProperties = {
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#333',
        marginBottom: '16px'
    };

    const postStatsStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        fontSize: '14px',
        color: '#666'
    };

    const statStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    };

    const loadingStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '60px 20px',
        fontSize: '18px',
        color: '#666'
    };

    const errorStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '40px 20px',
        backgroundColor: '#f8d7da',
        color: '#721c24',
        borderRadius: '8px',
        margin: '20px',
        border: '1px solid #f5c6cb'
    };

    const emptyStateStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#666'
    };

    const createPostButtonStyle: React.CSSProperties = {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block',
        marginTop: '16px'
    };

    return (
        <>
            <Head>
                <title>Home</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            <main className={styles.main}>

                {loading && (
                    <div style={loadingStyle}>
                        Loading posts...
                    </div>
                )}

                {error && (
                    <div style={errorStyle}>
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div style={feedContainerStyle}>
                        {posts.length === 0 ? (
                            <div style={emptyStateStyle}>
                                <h3>No posts yet!</h3>
                                <p>Be the first to share something with the community.</p>
                                {isAuthenticated() && (
                                    <a href="/posts/create" style={createPostButtonStyle}>
                                        Create First Post
                                    </a>
                                )}
                            </div>
                        ) : (
                            <>


                                {posts.map((post) => (
                                    <div
                                        key={post.id}
                                        style={postCardStyle}
                                        onClick={() => handlePostClick(post.id!)}
                                        onMouseEnter={(e) => Object.assign(e.currentTarget.style, postCardHoverStyle)}
                                        onMouseLeave={(e) => Object.assign(e.currentTarget.style, postCardStyle)}
                                    >
                                        <div style={postHeaderStyle}>
                                            <span style={communityStyle}>r/community</span>
                                            <span style={dotStyle}>•</span>
                                            <span>Posted by </span>
                                            <span style={authorStyle}>u/{post.user.username}</span>
                                            <span style={pointsStyle}>({post.user.points} pts)</span>
                                            <span style={dotStyle}>•</span>
                                            <span>{formatTimeAgo(post.createdAt)}</span>
                                        </div>

                                        <h3 style={postTitleStyle}>
                                            {post.title}
                                        </h3>

                                        <p style={postContentStyle}>
                                            {truncateContent(post.content)}
                                        </p>

                                        <div style={postStatsStyle}>
                                            <div style={statStyle}>
                                                <span>▲</span>
                                                <span>{post.comments?.length || 0}</span>
                                            </div>
                                            <div style={statStyle}>
                                                <span>💬</span>
                                                <span>{post.comments?.length || 0} comments</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isAuthenticated() && (
                                    <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
                                        <a href="/posts/create" style={createPostButtonStyle}>
                                            Create New Post
                                        </a>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </main>
        </>
    );
};

export default Home;