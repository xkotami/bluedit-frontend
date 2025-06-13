import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import { communityService, isAuthenticated, postService } from 'service/apiService';


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

interface Community {
    id?: number;
    posts: Post[];
    users: User[];
    name: string;
    description: string;
    createdAt: Date;
}

const CommunityDetailPage: React.FC = () => {
    const [community, setCommunity] = useState<Community | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [userCommunities, setUserCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);
    const [error, setError] = useState('');
    const [joinLoading, setJoinLoading] = useState(false);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            loadCommunityData();
            // loadCommunityPosts();
            if (isAuthenticated()) {
                loadUserCommunities();
            }
        }
    }, [id]);

    const loadCommunityData = async () => {
        try {
            const result = await communityService.getCommunityById(parseInt(id as string));
            if (result.success && result.data) {
                setCommunity(result.data);

                const sortedPosts = result.data.posts.sort((a, b) => {
                    const dateA = new Date(a.createdAt);
                    const dateB = new Date(b.createdAt);

                    // Handle invalid dates
                    if (isNaN(dateA.getTime())) return 1;
                    if (isNaN(dateB.getTime())) return -1;

                    return dateB.getTime() - dateA.getTime();
                });

                setPosts(sortedPosts);
                console.log(sortedPosts);
                setPostsLoading(false);
            } else {
                setError('Community not found');
            }
        } catch (err) {
            setError('Failed to load community');
        } finally {
            setLoading(false);
            setPostsLoading(false);
        }
    };

    // const loadCommunityPosts = async () => {
    //     try {
    //         const result = await postService.getPostsByCommunity(id as string);
    //         if (result.success && result.data) {
    //             // Filter out posts with invalid createdAt dates and sort by newest first
    //             const validPosts = result.data.filter(post =>
    //                 post && post.createdAt
    //             );
    //
    //             const sortedPosts = validPosts.sort((a, b) => {
    //                 const dateA = new Date(a.createdAt);
    //                 const dateB = new Date(b.createdAt);
    //
    //                 // Handle invalid dates
    //                 if (isNaN(dateA.getTime())) return 1;
    //                 if (isNaN(dateB.getTime())) return -1;
    //
    //                 return dateB.getTime() - dateA.getTime();
    //             });
    //
    //             setPosts(sortedPosts);
    //         } else {
    //             setPosts([]);
    //         }
    //     } catch (err) {
    //         console.error('Failed to load community posts:', err);
    //         setPosts([]);
    //     } finally {
    //         setPostsLoading(false);
    //     }
    // };

    const loadUserCommunities = async () => {
        try {
            const result = await communityService.getUserCommunities();
            if (result.success && result.data) {
                setUserCommunities(result.data);
            }
        } catch (err) {
            console.error('Failed to load user communities:', err);
        }
    };

    const handleJoinCommunity = async () => {
        if (!isAuthenticated()) {
            await router.push('/login');
            return;
        }

        setJoinLoading(true);
        try {
            const result = await communityService.joinCommunity(community!.id!);
            if (result.success) {
                await loadUserCommunities();
                await loadCommunityData(); // Refresh community to update member count
                setError('');
            } else {
                setError(result.error || 'Failed to join community');
            }
        } catch (err) {
            setError('Failed to join community');
        } finally {
            setJoinLoading(false);
        }
    };

    const handleLeaveCommunity = async () => {
        setJoinLoading(true);
        try {
            const result = await communityService.leaveCommunity(community!.id!);
            if (result.success) {
                await loadUserCommunities();
                await loadCommunityData(); // Refresh community to update member count
                setError('');
            } else {
                setError(result.error || 'Failed to leave community');
            }
        } catch (err) {
            setError('Failed to leave community');
        } finally {
            setJoinLoading(false);
        }
    };

    const isUserInCommunity = (): boolean => {
        return userCommunities.some(userCommunity => userCommunity.id === community?.id);
    };

    const formatTimeAgo = (date: Date | string): string => {
        // Handle null/undefined dates
        if (!date) {
            return 'Unknown time';
        }

        const now = new Date();
        const postDate = new Date(date);

        // Handle invalid dates
        if (isNaN(postDate.getTime())) {
            return 'Invalid date';
        }

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

    const handlePostClick = async (postId: number) => {
        await router.push(`/posts/${postId}`);
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };

    const communityHeaderStyle: React.CSSProperties = {
        backgroundColor: 'white',
        border: '1px solid #e1e1e1',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const communityTitleStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '8px'
    };

    const communityStatsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '24px',
        marginBottom: '16px',
        fontSize: '14px',
        color: '#666'
    };

    const statStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    };

    const communityDescStyle: React.CSSProperties = {
        fontSize: '16px',
        lineHeight: '1.5',
        color: '#555',
        marginBottom: '20px'
    };

    const actionButtonsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '12px',
        alignItems: 'center'
    };

    const joinButtonStyle: React.CSSProperties = {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
    };

    const leaveButtonStyle: React.CSSProperties = {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer'
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
        display: 'inline-block'
    };

    const disabledButtonStyle: React.CSSProperties = {
        backgroundColor: '#6c757d',
        cursor: 'not-allowed'
    };

    const postsHeaderStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e1e1e1'
    };

    const postsSectionTitleStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        margin: 0
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
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '12px',
        lineHeight: '1.3'
    };

    const postContentStyle: React.CSSProperties = {
        fontSize: '15px',
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
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        color: '#666'
    };

    const backButtonStyle: React.CSSProperties = {
        backgroundColor: 'transparent',
        color: '#007bff',
        border: '1px solid #007bff',
        borderRadius: '6px',
        padding: '8px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        marginBottom: '20px',
        textDecoration: 'none',
        display: 'inline-block'
    };

    if (loading) {
        return (
            <>
                <Head>
                    <title>Community | Setback</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Header />
                <div style={containerStyle}>
                    <div style={loadingStyle}>Loading community...</div>
                </div>
            </>
        );
    }

    if (error || !community) {
        return (
            <>
                <Head>
                    <title>Community | Setback</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Header />
                <div style={containerStyle}>
                    <div style={errorStyle}>
                        {error || 'Community not found'}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>r/{community.name} | Setback</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            
            <div style={containerStyle}>
                <a href="/community" style={backButtonStyle}>
                    ← Back to Communities
                </a>

                {/* Community Header */}
                <div style={communityHeaderStyle}>
                    <h1 style={communityTitleStyle}>r/{community.name}</h1>
                    
                    <div style={communityStatsStyle}>
                        <div style={statStyle}>
                            <span>👥</span>
                            <span>{community.users?.length || 0} members</span>
                        </div>
                        <div style={statStyle}>
                            <span>📝</span>
                            <span>{posts.length} posts</span>
                        </div>
                        <div style={statStyle}>
                            <span>📅</span>
                            <span>Created {formatTimeAgo(community.createdAt)}</span>
                        </div>
                    </div>

                    <p style={communityDescStyle}>
                        {community.description}
                    </p>

                    <div style={actionButtonsStyle}>
                        {isAuthenticated() && (
                            <>
                                {isUserInCommunity() ? (
                                    <button
                                        style={{
                                            ...leaveButtonStyle,
                                            ...(joinLoading ? disabledButtonStyle : {})
                                        }}
                                        onClick={handleLeaveCommunity}
                                        disabled={joinLoading}
                                    >
                                        {joinLoading ? 'Leaving...' : 'Leave Community'}
                                    </button>
                                ) : (
                                    <button
                                        style={{
                                            ...joinButtonStyle,
                                            ...(joinLoading ? disabledButtonStyle : {})
                                        }}
                                        onClick={handleJoinCommunity}
                                        disabled={joinLoading}
                                    >
                                        {joinLoading ? 'Joining...' : 'Join Community'}
                                    </button>
                                )}
                                
                                {isUserInCommunity() && (
                                    <a href="/posts/create" style={createPostButtonStyle}>
                                        Create Post
                                    </a>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Posts Section */}
                <div style={postsHeaderStyle}>
                    <h2 style={postsSectionTitleStyle}>
                        Posts ({posts.length})
                    </h2>
                </div>

                {postsLoading ? (
                    <div style={loadingStyle}>Loading posts...</div>
                ) : posts.length === 0 ? (
                    <div style={emptyStateStyle}>
                        <h3>No posts yet</h3>
                        <p>Be the first to share something in r/{community.name}!</p>
                        {isAuthenticated() && isUserInCommunity() && (
                            <a href="/posts/create" style={createPostButtonStyle}>
                                Create First Post
                            </a>
                        )}
                    </div>
                ) : (
                    <div>
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                style={postCardStyle}
                                onClick={() => handlePostClick(post.id!)}
                                onMouseEnter={(e) => Object.assign(e.currentTarget.style, postCardHoverStyle)}
                                onMouseLeave={(e) => Object.assign(e.currentTarget.style, postCardStyle)}
                            >
                                <div style={postHeaderStyle}>
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
                    </div>
                )}
            </div>
        </>
    );
};

export default CommunityDetailPage;