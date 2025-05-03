import Link from 'next/link';
import styles from '@styles/post.module.css';
import { Post } from '@types';

interface PostProps {
    post: Post;
}

const Post: React.FC<PostProps> = ({ post }) => {
    return (
        <div className={styles.post}>
            <div className={styles.voteContainer}>
                <button className={styles.upvote}>▲</button>
                <span className={styles.voteCount}>{post.user.points}</span>
                <button className={styles.downvote}>▼</button>
            </div>
            <div className={styles.postContent}>
                <div className={styles.postHeader}>
                    <span className={styles.author}>Posted by u/{post.user.username}</span>
                    <span className={styles.dot}>•</span>
                    <span className={styles.time}>{new Date(post.createdAt).toLocaleString()}</span>
                </div>

                <Link href={`/posts/${post.id}`} passHref>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                </Link>

                {post.description && (
                    <Link href={`/posts/${post.id}`} passHref>
                        <p className={styles.postText}>{post.description}</p>
                    </Link>
                )}

                <div className={styles.postActions}>
                    <Link href={`/posts/${post.id}`} passHref>
                        <button className={styles.actionButton}>
                            <span className={styles.actionIcon}>💬</span>
                            <span>{post.comments.length} Comments</span>
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