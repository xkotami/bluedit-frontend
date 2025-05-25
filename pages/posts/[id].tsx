import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import { commentService, isAuthenticated, postService, authService, communityService } from 'service/apiService';
import { Community } from '@types';
import community from '../community';

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
    community?: Community;
}

// Move CommentComponent outside of the main component to prevent re-creation
const CommentComponent: React.FC<{
    comment: Comment;
    depth: number;
    post: Post;
    replyTexts: {[key: number]: string};
    showReplyForms: {[key: number]: boolean};
    isAuthenticated: boolean;
    replyingTo: number | null;
    onToggleReplyForm: (commentId: number) => void;
    onReplyTextChange: (commentId: number, text: string) => void;
    onCreateReply: (parentCommentId: number, postId: number) => void;
    formatTimeAgo: (date: Date | string) => string;
}> = ({
          comment,
          depth,
          post,
          replyTexts,
          showReplyForms,
          isAuthenticated,
          replyingTo,
          onToggleReplyForm,
          onReplyTextChange,
          onCreateReply,
          formatTimeAgo
      }) => {
    const indentStyle: React.CSSProperties = {
        marginLeft: `${Math.min(depth * 20, 100)}px`,
        borderLeft: depth > 0 ? '2px solid #e1e1e1' : 'none',
        paddingLeft: depth > 0 ? '16px' : '0',
        marginBottom: '16px'
    };

    const commentCardStyle: React.CSSProperties = {
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '12px'
    };

    const commentHeaderStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    };

    const commentAuthorStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center'
    };

    const commentMetaStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px'
    };

    const commentPointsStyle: React.CSSProperties = {
        color: '#28a745',
        fontWeight: '600'
    };

    const authorStyle: React.CSSProperties = {
        color: '#333',
        fontWeight: '600'
    };

    const pointsStyle: React.CSSProperties = {
        color: '#28a745',
        fontSize: '12px',
        marginLeft: '4px'
    };

    const dotStyle: React.CSSProperties = {
        color: '#ccc'
    };

    const dateStyle: React.CSSProperties = {
        color: '#888'
    };

    const commentTextStyle: React.CSSProperties = {
        fontSize: '14px',
        lineHeight: '1.5',
        marginBottom: '12px',
        color: '#333',
        whiteSpace: 'pre-wrap'
    };

    const commentActionsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '12px'
    };

    const actionButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: '#007bff',
        fontSize: '12px',
        cursor: 'pointer',
        padding: '4px 8px',
        borderRadius: '4px',
        transition: 'background-color 0.2s ease'
    };

    const replyFormStyle: React.CSSProperties = {
        marginTop: '16px',
        padding: '16px',
        backgroundColor: 'white',
        border: '1px solid #ddd',
        borderRadius: '6px'
    };

    const replyTextareaStyle: React.CSSProperties = {
        width: '100%',
        padding: '10px 12px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '13px',
        fontFamily: 'inherit',
        resize: 'vertical',
        boxSizing: 'border-box',
        outline: 'none'
    };

    const replyFormActionsStyle: React.CSSProperties = {
        display: 'flex',
        gap: '8px',
        marginTop: '12px'
    };

    const submitReplyButtonStyle: React.CSSProperties = {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 12px',
        fontSize: '12px',
        cursor: 'pointer',
        opacity: replyingTo === comment.id ? 0.6 : 1,
        pointerEvents: replyingTo === comment.id ? 'none' : 'auto'
    };

    const cancelButtonStyle: React.CSSProperties = {
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '6px 12px',
        fontSize: '12px',
        cursor: 'pointer'
    };

    return (
        <div style={indentStyle}>
            <div style={commentCardStyle}>
                <div style={commentHeaderStyle}>
                    <div style={commentAuthorStyle}>
                        <span style={authorStyle}>u/{comment.createdBy.username}</span>
                        <span style={pointsStyle}>({comment.createdBy.points} pts)</span>
                    </div>
                    <div style={commentMetaStyle}>
                        <span style={commentPointsStyle}>▲ {comment.points}</span>
                        <span style={dotStyle}>•</span>
                        <span style={dateStyle}>{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                </div>

                <div style={commentTextStyle}>
                    {comment.text}
                </div>

                <div style={commentActionsStyle}>
                    {isAuthenticated && (
                        <button
                            style={actionButtonStyle}
                            onClick={() => onToggleReplyForm(comment.id!)}
                        >
                            Reply
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {showReplyForms[comment.id!] && (
                    <div style={replyFormStyle}>
                        <textarea
                            value={replyTexts[comment.id!] || ''}
                            onChange={(e) => onReplyTextChange(comment.id!, e.target.value)}
                            placeholder="Write a reply..."
                            style={replyTextareaStyle}
                            rows={3}
                        />
                        <div style={replyFormActionsStyle}>
                            <button
                                onClick={() => onCreateReply(comment.id!, post.id!)}
                                disabled={replyingTo === comment.id || !replyTexts[comment.id!]?.trim()}
                                style={submitReplyButtonStyle}
                            >
                                {replyingTo === comment.id ? 'Replying...' : 'Reply'}
                            </button>
                            <button
                                onClick={() => onToggleReplyForm(comment.id!)}
                                style={cancelButtonStyle}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {            /* Render Replies */}
            {comment.replies && comment.replies.length > 0 && comment.replies.map(reply => (
                <CommentComponent
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    post={post}
                    replyTexts={replyTexts}
                    showReplyForms={showReplyForms}
                    isAuthenticated={isAuthenticated}
                    replyingTo={replyingTo}
                    onToggleReplyForm={onToggleReplyForm}
                    onReplyTextChange={onReplyTextChange}
                    onCreateReply={onCreateReply}
                    formatTimeAgo={formatTimeAgo}
                />
            ))}
        </div>
    );
};

const PostDetailPage: React.FC = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentText, setCommentText] = useState('');
    const [replyTexts, setReplyTexts] = useState<{[key: number]: string}>({});
    const [showReplyForms, setShowReplyForms] = useState<{[key: number]: boolean}>({});
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (id) {
            loadPost();
            loadCurrentUser();
        }
    }, [id]);

    const loadCurrentUser = async () => {
        try {
            if (isAuthenticated()) {
                const userId = localStorage.getItem('userId');
                if (!userId) throw new Error("User not logged in");

                const user = await authService.getCurrentUser(userId);
                setCurrentUser(user);
            }
        } catch (err) {
            console.error('Failed to load current user:', err);
        }
    };

    const loadPost = async () => {
        try {
            const result = await postService.getPostById(id as string);
            const result2 = await communityService.getAllCommunities();

            if (result.success && result.data && result2.data) {
                // @ts-ignore
                result.data.community = result2.data.find(c => c.posts.find(p => p.id === result.data.id));

                // Build nested comment structure if not already structured
                const structuredPost = {
                    ...result.data,
                    comments: buildCommentTree(result.data.comments || [])
                };
                setPost(structuredPost);
            } else {
                setError('Post not found');
            }
        } catch (err) {
            setError('Failed to load post');
            console.error('Error loading post:', err);
        } finally {
            setLoading(false);
        }
    };

    // Helper function to build nested comment structure
    const buildCommentTree = (comments: Comment[]): Comment[] => {
        const commentMap = new Map<number, Comment>();
        const rootComments: Comment[] = [];

        // First pass: create a map of all comments and initialize replies array
        comments.forEach(comment => {
            commentMap.set(comment.id!, {
                ...comment,
                replies: []
            });
        });

        // Second pass: build the tree structure
        comments.forEach(comment => {
            const commentWithReplies = commentMap.get(comment.id!)!;

            if (comment.parent?.id) {
                // This is a reply, add it to parent's replies
                const parentComment = commentMap.get(comment.parent.id);
                if (parentComment) {
                    parentComment.replies.push(commentWithReplies);
                } else {
                    // Parent not found, treat as root comment
                    rootComments.push(commentWithReplies);
                }
            } else {
                // This is a root comment
                rootComments.push(commentWithReplies);
            }
        });

        return rootComments;
    };

    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !post?.id) return;

        if (!isAuthenticated() || !currentUser?.id) {
            await router.push('/login');
            return;
        }

        setSubmitting(true);
        setError(''); // Clear previous errors

        try {
            // Create comment payload matching your backend API
            const commentData = {
                text: commentText.trim(),
                postId: post.id,
                userId: currentUser.id
            };

            console.log('Creating comment with data:', commentData);

            const result = await commentService.createComment(commentData);

            if (result.success) {
                setCommentText('');
                await loadPost(); // Refresh post to get new comment
                console.log('Comment created successfully');
            } else {
                const errorMessage = result.error || 'Failed to create comment';
                setError(errorMessage);
                console.error('Failed to create comment:', errorMessage);
            }
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to create comment';
            setError(errorMessage);
            console.error('Error creating comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateReply = useCallback(async (parentCommentId: number, postId: number) => {
        const replyText = replyTexts[parentCommentId];
        if (!replyText?.trim()) return;

        if (!isAuthenticated() || !currentUser?.id) {
            await router.push('/login');
            return;
        }

        setReplyingTo(parentCommentId);
        setError(''); // Clear previous errors

        try {
            // Create reply payload matching your backend API
            const replyData = {
                text: replyText.trim(),
                postId: postId,
                userId: currentUser.id,
                parentId: parentCommentId // Add parent comment ID for replies
            };

            console.log('Creating reply with data:', replyData);

            const result = await commentService.createReply(replyData);

            if (result.success) {
                setReplyTexts(prev => ({...prev, [parentCommentId]: ''}));
                setShowReplyForms(prev => ({...prev, [parentCommentId]: false}));
                await loadPost(); // Refresh post to get new reply
                console.log('Reply created successfully');
            } else {
                const errorMessage = result.error || 'Failed to create reply';
                setError(errorMessage);
                console.error('Failed to create reply:', errorMessage);
            }
        } catch (err: any) {
            const errorMessage = err?.message || 'Failed to create reply';
            setError(errorMessage);
            console.error('Error creating reply:', err);
        } finally {
            setReplyingTo(null);
        }
    }, [replyTexts, currentUser, router]);

    const toggleReplyForm = useCallback((commentId: number) => {
        setShowReplyForms(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
        // Clear any existing error when opening reply form
        setError('');
    }, []);

    const handleReplyTextChange = useCallback((commentId: number, text: string) => {
        setReplyTexts(prev => ({
            ...prev,
            [commentId]: text
        }));
    }, []);

    const formatTimeAgo = useCallback((date: Date | string): string => {
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
    }, []);

    const containerStyle: React.CSSProperties = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
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

    const postCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        border: '1px solid #e1e1e1',
        borderRadius: '8px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const postTitleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '16px',
        lineHeight: '1.3'
    };

    const postMetaStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#666'
    };

    const communityStyle: React.CSSProperties = {
        color: '#007bff',
        fontWeight: '600',
        textDecoration: 'none',
        cursor: 'pointer'
    };

    const authorStyle: React.CSSProperties = {
        color: '#333',
        fontWeight: '600'
    };

    const pointsStyle: React.CSSProperties = {
        color: '#28a745',
        fontSize: '12px',
        marginLeft: '4px'
    };

    const dotStyle: React.CSSProperties = {
        color: '#ccc'
    };

    const dateStyle: React.CSSProperties = {
        color: '#888'
    };

    const postContentStyle: React.CSSProperties = {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#333',
        marginBottom: '20px',
        whiteSpace: 'pre-wrap'
    };

    const postStatsStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        paddingTop: '16px',
        borderTop: '1px solid #e1e1e1',
        fontSize: '14px',
        color: '#666'
    };

    const statStyle: React.CSSProperties = {
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
    };

    const commentSectionStyle: React.CSSProperties = {
        backgroundColor: 'white',
        border: '1px solid #e1e1e1',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const commentSectionTitleStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '20px'
    };

    const commentFormStyle: React.CSSProperties = {
        marginBottom: '24px',
        paddingBottom: '24px',
        borderBottom: '1px solid #e1e1e1'
    };

    const textareaStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e1e1e1',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'inherit',
        resize: 'vertical',
        boxSizing: 'border-box',
        lineHeight: '1.5',
        outline: 'none'
    };

    const textareaFocusStyle: React.CSSProperties = {
        borderColor: '#007bff',
        boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)'
    };

    const submitButtonStyle: React.CSSProperties = {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '12px',
        opacity: submitting ? 0.6 : 1,
        pointerEvents: submitting ? 'none' : 'auto'
    };

    const errorStyle: React.CSSProperties = {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb'
    };

    const loadingStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '60px',
        fontSize: '18px',
        color: '#666'
    };

    const loginPromptStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '6px',
        marginBottom: '24px'
    };

    if (loading) {
        return (
            <>
                <Head>
                    <title>Post | Setback</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Header />
                <div style={containerStyle}>
                    <div style={loadingStyle}>Loading post...</div>
                </div>
            </>
        );
    }

    if (!post) {
        return (
            <>
                <Head>
                    <title>Post Not Found | Setback</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Header />
                <div style={containerStyle}>
                    <div style={errorStyle}>Post not found</div>
                </div>
            </>
        );
    }

    // Since we've already structured the comments in buildCommentTree,
    // post.comments should only contain top-level comments
    const topLevelComments = post.comments || [];

    return (
        <>
            <Head>
                <title>{post.title} | Setback</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />

            <div style={containerStyle}>
                <button onClick={() => router.back()} style={backButtonStyle}>
                    ← Back
                </button>

                {error && (
                    <div style={errorStyle}>
                        {error}
                    </div>
                )}

                {/* Post Content */}
                <div style={postCardStyle}>
                    <h1 style={postTitleStyle}>{post.title}</h1>

                    <div style={postMetaStyle}>
                        <span style={communityStyle} onClick={() => router.push(`/communities/${post?.community?.id}`)}>r/{post.community ? post.community.name : "community"}</span>
                        <span style={dotStyle}>•</span>
                        <span>Posted by </span>
                        <span style={authorStyle}>u/{post.user.username}</span>
                        <span style={pointsStyle}>({post.user.points} pts)</span>
                        <span style={dotStyle}>•</span>
                        <span style={dateStyle}>{formatTimeAgo(post.createdAt)}</span>
                    </div>

                    <div style={postContentStyle}>{post.content}</div>

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

                {/* Comments Section */}
                <div style={commentSectionStyle}>
                    <h3 style={commentSectionTitleStyle}>
                        Comments ({topLevelComments.length})
                    </h3>

                    {/* Comment Form */}
                    {isAuthenticated() && currentUser ? (
                        <form onSubmit={handleCreateComment} style={commentFormStyle}>
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Share your thoughts..."
                                style={textareaStyle}
                                rows={4}
                                required
                                disabled={submitting}
                                onFocus={(e) => Object.assign(e.target.style, textareaFocusStyle)}
                                onBlur={(e) => Object.assign(e.target.style, textareaStyle)}
                            />
                            <button
                                type="submit"
                                disabled={submitting || !commentText.trim()}
                                style={submitButtonStyle}
                            >
                                {submitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </form>
                    ) : (
                        <div style={loginPromptStyle}>
                            <a href="/login" style={{ color: '#007bff', textDecoration: 'none' }}>
                                Log in to join the discussion
                            </a>
                        </div>
                    )}

                    {/* Comments List */}
                    {topLevelComments.length > 0 ? (
                        <div>
                            {topLevelComments.map(comment => (
                                <CommentComponent
                                    key={comment.id}
                                    comment={comment}
                                    depth={0}
                                    post={post}
                                    replyTexts={replyTexts}
                                    showReplyForms={showReplyForms}
                                    isAuthenticated={isAuthenticated()}
                                    replyingTo={replyingTo}
                                    onToggleReplyForm={toggleReplyForm}
                                    onReplyTextChange={handleReplyTextChange}
                                    onCreateReply={handleCreateReply}
                                    formatTimeAgo={formatTimeAgo}
                                />
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            No comments yet. Be the first to share your thoughts!
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default PostDetailPage;