import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/postDetail.module.css';
import { useEffect, useState } from 'react';
import { Post, Comment, Community } from '@types';
import postService from '@services/PostService';
import communityService from '@services/CommunityService';
import { useUser } from '../../hooks/useUser';
import commentService from '@services/CommentService';

const PostDetail = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [community, setCommunity] = useState<Community | null>(null);
    const [commentText, setCommentText] = useState('');
    const [replyTexts, setReplyTexts] = useState<{[key: number]: string}>({});
    const [showReplyForms, setShowReplyForms] = useState<{[key: number]: boolean}>({});
    const [submitting, setSubmitting] = useState(false);
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { id } = router.query;
    const { userData, isUserLoading, userError } = useUser();

    const fetchPost = async () => {
        if (!id) return;
        const response = await postService.getPostById(Number(id as string));
        const postResponse = await response.json();
        setPost(postResponse);
    };

    const fetchCommunity = async () => {
        const response = await communityService.findCommunityByPostId(Number(id as string));
        const communityResponse = await response.json();
        setCommunity(communityResponse);
    }

    useEffect(() => {
        if (id) {
            fetchPost();
            fetchCommunity();
        }
    }, [id]);

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

    const handleCreateComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !post?.id) return;

        if (!userData) {
            router.push('/login');
            return;
        }

        setSubmitting(true);
        setError(''); // Clear previous errors

        try {
            const commentData = {
                text: commentText.trim(),
                postId: post.id,
                userId: userData.id
            };
            const response = await commentService.createComment(commentData, userData.token);
            const commentResponse = await response.json();

            if (commentResponse) {
                setCommentText('');
                await fetchPost(); // Refresh post to get new comment
                console.log('Comment created successfully');
            } else {
                const errorMessage = commentResponse.error || 'Failed to create comment';
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

    const handleCreateReply = async (parentCommentId: number, postId: number) => {
        const replyText = replyTexts[parentCommentId];
        if (!replyText?.trim()) return;

        if (!userData) {
            router.push('/login');
            return;
        }

        setReplyingTo(parentCommentId);
        setError(''); // Clear previous errors

        try {
            const response = await commentService.createReply(replyText.trim(), postId, parentCommentId, userData.token);
            const replyResponse = await response.json();

            if (replyResponse) {
                setReplyTexts(prev => ({...prev, [parentCommentId]: ''}));
                setShowReplyForms(prev => ({...prev, [parentCommentId]: false}));
                await fetchPost(); // Refresh post to get new reply
                console.log('Reply created successfully');
            } else {
                const errorMessage = replyResponse.error || 'Failed to create reply';
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
    };

    const toggleReplyForm = (commentId: number) => {
        setShowReplyForms(prev => ({
            ...prev,
            [commentId]: !prev[commentId]
        }));
        if (!showReplyForms[commentId]) {
            setError('');
        }
    };

    // Function to organize comments into a tree structure
    const organizeComments = (comments: Comment[]): Comment[] => {
        if (!comments) return [];

        const commentMap = new Map<number, Comment>();
        const topLevelComments: Comment[] = [];

        // First pass: create a map of all comments
        comments.forEach(comment => {
            commentMap.set(comment.id, {
                ...comment,
                replies: []
            });
        });

        // Second pass: organize into tree structure
        comments.forEach(comment => {
            if (comment.parent && comment.parent.id) {
                // This is a reply, add it to its parent's replies
                const parentComment = commentMap.get(comment.parent.id);
                if (parentComment) {
                    if (!parentComment.replies) {
                        parentComment.replies = [];
                    }
                    parentComment.replies.push(commentMap.get(comment.id)!);
                }
            } else {
                // This is a top-level comment
                topLevelComments.push(commentMap.get(comment.id)!);
            }
        });

        return topLevelComments;
    };

    // Recursive component to render threaded comments
    const CommentComponent: React.FC<{comment: Comment, depth: number}> = ({ comment, depth }) => {
        return (
            <div className={styles.commentThread} style={{marginLeft: `${Math.min(depth * 20, 100)}px`}}>
                <div className={styles.commentCard}>
                    <div className={styles.commentVotes}>
                        <button className={styles.upvote}>▲</button>
                        <span className={styles.voteCount}>{comment.points || 0}</span>
                        <button className={styles.downvote}>▼</button>
                    </div>

                    <div className={styles.commentContent}>
                        <div className={styles.commentHeader}>
                            <div className={styles.commentAuthor}>
                                <span className={styles.author}>u/{comment.createdBy.username}</span>
                                <span className={styles.authorPoints}>({comment.createdBy.points} pts)</span>
                            </div>
                            <div className={styles.commentMeta}>
                                <span className={styles.time}>{formatTimeAgo(comment.createdAt)}</span>
                            </div>
                        </div>

                        <p className={styles.commentText}>{comment.text}</p>

                        <div className={styles.commentActions}>
                            {userData && (
                                <button
                                    className={styles.actionButton}
                                    onClick={() => toggleReplyForm(comment.id!)}
                                >
                                    Reply
                                </button>
                            )}
                            <button className={styles.actionButton}>Share</button>
                            <button className={styles.actionButton}>Report</button>
                        </div>

                        {/* Reply Form */}
                        {showReplyForms[comment.id!] && (
                            <div className={styles.replyForm}>
                                <textarea
                                    value={replyTexts[comment.id!] || ''}
                                    onChange={(e) => setReplyTexts(prev => ({
                                        ...prev,
                                        [comment.id!]: e.target.value
                                    }))}
                                    placeholder="Write a reply..."
                                    className={styles.replyTextarea}
                                    rows={3}
                                />
                                <div className={styles.replyFormActions}>
                                    <button
                                        onClick={() => handleCreateReply(comment.id, Number(id as string))}
                                        disabled={replyingTo === comment.id || !replyTexts[comment.id!]?.trim()}
                                        className={styles.submitReplyButton}
                                    >
                                        {replyingTo === comment.id ? 'Replying...' : 'Reply'}
                                    </button>
                                    <button
                                        onClick={() => toggleReplyForm(comment.id!)}
                                        className={styles.cancelButton}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Render Replies */}
                {comment.replies && comment.replies.length > 0 && comment.replies.map(reply => (
                    <CommentComponent
                        key={reply.id}
                        comment={reply}
                        depth={depth + 1}
                    />
                ))}
            </div>
        );
    };

    if (!post) return <div className={styles.loading}>Loading...</div>;

    // Use the new organizeComments function
    const organizedComments = organizeComments(post.comments || []);

    return (
        <>
            <Head>
                <title>{post.title} | Bluedit</title>
            </Head>
            <Header />

            <main className={styles.container}>
                <div className={styles.postContainer}>
                    <button onClick={() => router.back()} className={styles.backButton}>
                        ← Back
                    </button>

                    {error && (
                        <div className={styles.errorMessage}>
                            {error}
                        </div>
                    )}

                    <div className={styles.postCard}>
                        <div className={styles.voteContainer}>
                            <button className={styles.upvote}>▲</button>
                            <span className={styles.voteCount}>{post.points || 0}</span>
                            <button className={styles.downvote}>▼</button>
                        </div>

                        <div className={styles.postContent}>
                            <h1 className={styles.postTitle}>{post.title}</h1>

                            <div className={styles.postHeader}>
                                <span className={styles.user}>Posted by u/{post.user.username}</span>
                                <span className={styles.authorPoints}>({post.user.points} pts)</span>
                                <span className={styles.dot}>•</span>
                                <span className={styles.time}>
                                    {formatTimeAgo(post.createdAt)}
                                </span>
                            </div>

                            {post.content && (
                                <div className={styles.postText}>
                                    {post.content.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            )}

                            <div className={styles.postStats}>
                                <div className={styles.statItem}>
                                    <span>▲</span>
                                    <span>{post.points || 0}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span>💬</span>
                                    <span>{post.comments?.length || 0} comments</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className={styles.commentSection}>
                        <h3 className={styles.commentSectionTitle}>
                            Comments ({organizedComments.length})
                        </h3>

                        {/* Comment Form */}
                        {userData ? (
                            <form onSubmit={handleCreateComment} className={styles.commentForm}>
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Share your thoughts..."
                                    className={styles.commentInput}
                                    rows={4}
                                    required
                                    disabled={submitting}
                                />
                                <button
                                    type="submit"
                                    disabled={submitting || !commentText.trim()}
                                    className={styles.commentButton}
                                >
                                    {submitting ? 'Posting...' : 'Post Comment'}
                                </button>
                            </form>
                        ) : (
                            <div className={styles.loginPrompt}>
                                <a href="/login" className={styles.loginLink}>
                                    Log in to join the discussion
                                </a>
                            </div>
                        )}

                        <div className={styles.commentsSection}>
                            <div className={styles.sortOptions}>
                                <span className={styles.sortOptionActive}>Best</span>
                                <span className={styles.sortOption}>Top</span>
                                <span className={styles.sortOption}>New</span>
                            </div>

                            {/* Comments List */}
                            {organizedComments.length > 0 ? (
                                <div>
                                    {organizedComments.map(comment => (
                                        <CommentComponent
                                            key={comment.id}
                                            comment={comment}
                                            depth={0}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className={styles.noComments}>
                                    No comments yet. Be the first to share your thoughts!
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {community && (
                    <aside className={styles.sidebar}>
                        <div className={styles.communityCard}>
                            <div className={styles.communityHeader}>
                                <h3>About b/{community.name.replaceAll(' ', '')}</h3>
                            </div>
                            <div className={styles.communityDescription}>
                                <p>{community.description}</p>
                            </div>
                            <div className={styles.communityStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{community.users.length}</span>
                                    <span className={styles.statLabel}>
                                        {community.users.length == 1 ? "Member" : "Members"}
                                    </span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{community.posts.length}</span>
                                    <span className={styles.statLabel}>
                                        {community.posts.length == 1 ? "Post" : "Posts"}
                                    </span>
                                </div>
                            </div>
                            <button
                                className={styles.joinButton}
                                onClick={() => router.push(`/b/${community.id}`)}
                            >
                                Visit
                            </button>
                        </div>
                    </aside>
                )}
            </main>
        </>
    );
};

export default PostDetail;