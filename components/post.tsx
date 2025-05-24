import Link from 'next/link';
import styles from '@styles/post.module.css';
import { Post } from '@types';
import { useState } from 'react';

interface PostProps {
    post: Post;
}

const Post: React.FC<PostProps> = ({ post }) => {
    const [voteState, setVoteState] = useState<'up' | 'down' | null>(null);
    const [voteCount, setVoteCount] = useState(post.user.points || 0);
    const [isVoting, setIsVoting] = useState(false);

    const handleVote = async (type: 'up' | 'down') => {
        if (isVoting) return;

        setIsVoting(true);
        try {
            // TODO: Implement actual voting logic
            let newCount = post.user.points || 0;

            if (voteState === type) {
                // Remove vote
                setVoteState(null);
                newCount = type === 'up' ? newCount - 1 : newCount + 1;
            } else if (voteState === null) {
                // Add new vote
                setVoteState(type);
                newCount = type === 'up' ? newCount + 1 : newCount - 1;
            } else {
                // Switch vote
                setVoteState(type);
                newCount = type === 'up' ? newCount + 2 : newCount - 2;
            }

            setVoteCount(newCount);
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'now';
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 24 * 7) return `${Math.floor(diffInHours / 24)}d ago`;
        return date.toLocaleDateString();
    };

    const truncateContent = (content: string, maxLength: number = 300) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    return (
        <div className={styles.postCard}>
            <div className={styles.voteContainer}>
                <button
                    className={`${styles.voteButton} ${styles.upvote} ${voteState === 'up' ? styles.voted : ''}`}
                    onClick={() => handleVote('up')}
                    disabled={isVoting}
                    aria-label="Upvote"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 2l6 6H10v6H6V8H2l6-6z"/>
                    </svg>
                </button>
                <span className={`${styles.voteCount} ${voteState === 'up' ? styles.upvoted : voteState === 'down' ? styles.downvoted : ''}`}>
                    {voteCount}
                </span>
                <button
                    className={`${styles.voteButton} ${styles.downvote} ${voteState === 'down' ? styles.voted : ''}`}
                    onClick={() => handleVote('down')}
                    disabled={isVoting}
                    aria-label="Downvote"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 14L2 8h4V2h4v6h4l-6 6z"/>
                    </svg>
                </button>
            </div>

            <div className={styles.postContent}>
                <div className={styles.postHeader}>
                    <div className={styles.postMeta}>
                        <span className={styles.author}>u/{post.user.username}</span>
                        <span className={styles.dot}>•</span>
                        <span className={styles.time}>{formatTime(post.createdAt.toString())}</span>
                    </div>
                </div>

                <Link href={`/posts/${post.id}`} className={styles.postLink}>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                </Link>

                {post.content && (
                    <Link href={`/posts/${post.id}`} className={styles.postLink}>
                        <div className={styles.postText}>
                            {truncateContent(post.content)}
                        </div>
                    </Link>
                )}

                <div className={styles.postActions}>
                    <Link href={`/posts/${post.id}`} className={styles.actionLink}>
                        <button className={styles.actionButton}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M2 2h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H4.414L2 14.414V3a1 1 0 0 1 1-1z"/>
                            </svg>
                            <span>{post.comments?.length || 0} Comments</span>
                        </button>
                    </Link>

                    <button className={styles.actionButton}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M15 7H9V1H7v6H1v2h6v6h2V9h6V7z"/>
                        </svg>
                        <span>Share</span>
                    </button>

                    <button className={styles.actionButton}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 12l-4.7-4.7 1.4-1.4L8 9.2l3.3-3.3 1.4 1.4L8 12z"/>
                        </svg>
                        <span>Save</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Post;