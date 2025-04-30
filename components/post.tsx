import Link from 'next/link';
import styles from '@styles/post.module.css';

interface PostProps {
    post: {
        id: number;
        title: string;
        author: string;
        subreddit: string;
        upvotes: string;
        commentsCount: string;
        timePosted: string;
        content: {
            type: 'text' | 'image';
            text?: string;
            url?: string;
        };
    };
}

const Post: React.FC<PostProps> = ({ post }) => {
    return (
        <div className={styles.post}>
            <div className={styles.voteContainer}>
                <button className={styles.upvote}>▲</button>
                <span className={styles.voteCount}>{post.upvotes}</span>
                <button className={styles.downvote}>▼</button>
            </div>
            <div className={styles.postContent}>
                <div className={styles.postHeader}>
                    <span className={styles.subreddit}>r/{post.subreddit}</span>
                    <span className={styles.dot}>•</span>
                    <span className={styles.author}>Posted by u/{post.author}</span>
                    <span className={styles.dot}>•</span>
                    <span className={styles.time}>{post.timePosted}</span>
                </div>

                <Link href={`/posts/${post.id}`} passHref>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                </Link>

                {post.content.type === 'image' && (
                    <Link href={`/posts/${post.id}`} passHref>
                        <img
                            src={post.content.url}
                            alt="Post content"
                            className={styles.postImage}
                        />
                    </Link>
                )}
                {post.content.type === 'text' && (
                    <Link href={`/posts/${post.id}`} passHref>
                        <p className={styles.postText}>{post.content.text}</p>
                    </Link>
                )}
                <div className={styles.postActions}>
                    <Link href={`/posts/${post.id}`} passHref>
                        <button className={styles.actionButton}>
                            <span className={styles.actionIcon}>💬</span>
                            <span>{post.commentsCount} Comments</span>
                        </button>
                    </Link>
                    <button className={styles.actionButton}>
                        <span className={styles.actionIcon}>↻</span>
                        <span>Share</span>
                    </button>
                    <button className={styles.actionButton}>
                        <span className={styles.actionIcon}>⭐</span>
                        <span>Save</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Post;