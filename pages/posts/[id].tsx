import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/postDetail.module.css';
import { useEffect, useState } from 'react';
import { Post, Comment } from '@types';
import postService from '@services/PostService';

const PostDetail = () => {
    const [post, setPost] = useState<Post | null>(null);
    const router = useRouter();
    const { id } = router.query;

    const fetchPost = async () => {
        if (!id) return;
        const response = await postService.getPostById(id as string);
        const postResponse = await response.json();
        setPost(postResponse);
    };

    useEffect(() => {
        fetchPost();
    }, [id]);

    if (!post) return <div>Loading...</div>;

    return (
        <>
            <Head>
                <title>{post.title} | Setback</title>
            </Head>
            <Header />

            <main className={styles.container}>
                <div className={styles.postContainer}>
                    <div className={styles.post}>
                        <div className={styles.voteContainer}>
                            <button className={styles.upvote}>▲</button>
                            <span className={styles.voteCount}>{post.user.points}</span>
                            <button className={styles.downvote}>▼</button>
                        </div>

                        <div className={styles.postContent}>
                            <div className={styles.postHeader}>
                                <span className={styles.user}>Posted by u/{post.user.username}</span>
                                <span className={styles.dot}>•</span>
                                <span className={styles.time}>
                                    {new Date(post.createdAt).toLocaleString()}
                                </span>
                            </div>

                            <h1 className={styles.postTitle}>{post.title}</h1>

                            {post.description && (
                                <div className={styles.postText}>
                                    {post.description.split('\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            )}

                            <div className={styles.postActions}>
                                <button className={styles.actionButton}>
                                    <span className={styles.actionIcon}>💬</span>
                                    <span>{post.comments.length} Comments</span>
                                </button>
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

                    <div className={styles.commentForm}>
                        <textarea
                            placeholder="What are your thoughts?"
                            className={styles.commentInput}
                        />
                        <button className={styles.commentButton}>Comment</button>
                    </div>

                    <div className={styles.commentsSection}>
                        <div className={styles.sortOptions}>
                            <span className={styles.sortOptionActive}>Best</span>
                            <span className={styles.sortOption}>Top</span>
                            <span className={styles.sortOption}>New</span>
                        </div>

                        {post.comments.map((comment: Comment) => (
                            <div key={comment.id} className={styles.comment}>
                                <div className={styles.commentVotes}>
                                    <button className={styles.upvote}>▲</button>
                                    <span className={styles.voteCount}>{comment.points}</span>
                                    <button className={styles.downvote}>▼</button>
                                </div>

                                <div className={styles.commentContent}>
                                    <div className={styles.commentHeader}>
                                        <span className={styles.author}>u/{comment.createdBy.username}</span>
                                        <span className={styles.dot}>•</span>
                                        <span className={styles.time}>
                                            {new Date(comment.createdAt).toLocaleString()}
                                        </span>
                                    </div>

                                    <p className={styles.commentText}>{comment.text}</p>

                                    <div className={styles.commentActions}>
                                        <button className={styles.actionButton}>Reply</button>
                                        <button className={styles.actionButton}>Share</button>
                                        <button className={styles.actionButton}>Report</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <aside className={styles.sidebar}>
                    <div className={styles.communityCard}>
                        <div className={styles.communityHeader}>
                            <h3>About Community</h3>
                        </div>
                        <div className={styles.communityDescription}>
                            <p>Welcome to this community for discussing...</p>
                        </div>
                        <div className={styles.communityStats}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>1.2M</span>
                                <span className={styles.statLabel}>Members</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>2.4K</span>
                                <span className={styles.statLabel}>Online</span>
                            </div>
                        </div>
                        <button className={styles.joinButton}>Join</button>
                    </div>
                </aside>
            </main>
        </>
    );
};

export default PostDetail;