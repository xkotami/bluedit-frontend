import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/postDetail.module.css';

interface Comment {
    id: number;
    author: string;
    timePosted: string;
    text: string;
    upvotes: string;
}

interface PostDetailData {
    id: string | string[];
    title: string;
    author: string;
    subreddit: string;
    upvotes: string;
    commentsCount: string;
    timePosted: string;
    content: {
        text: string;
    };
    comments: Comment[];
}

const PostDetail = () => {
    const router = useRouter();
    const { id } = router.query;

//
    // @ts-ignore
    const post: PostDetailData = {
        id: id,
        title: 'Example post title',
        author: 'username',
        subreddit: 'community',
        upvotes: '33K',
        commentsCount: '2.2K',
        timePosted: '8 hr. ago',
        content: {
            text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...'
        },
        comments: [
            {
                id: 1,
                author: 'user1',
                timePosted: '5 hr. ago',
                text: 'This is a great post! Thanks for sharing.',
                upvotes: '1.2K'
            },
            {
                id: 2,
                author: 'user2',
                timePosted: '4 hr. ago',
                text: 'I completely agree with this viewpoint.',
                upvotes: '845'
            }
        ]
    };

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

                            <h1 className={styles.postTitle}>{post.title}</h1>

                            <div className={styles.postText}>
                                {post.content.text.split('\n').map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                            </div>

                            <div className={styles.postActions}>
                                <button className={styles.actionButton}>
                                    <span className={styles.actionIcon}>💬</span>
                                    <span>{post.commentsCount} Comments</span>
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

                        {post.comments.map(comment => (
                            <div key={comment.id} className={styles.comment}>
                                <div className={styles.commentVotes}>
                                    <button className={styles.upvote}>▲</button>
                                    <span className={styles.voteCount}>{comment.upvotes}</span>
                                    <button className={styles.downvote}>▼</button>
                                </div>

                                <div className={styles.commentContent}>
                                    <div className={styles.commentHeader}>
                                        <span className={styles.author}>u/{comment.author}</span>
                                        <span className={styles.dot}>•</span>
                                        <span className={styles.time}>{comment.timePosted}</span>
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
                            <p>Welcome to r/{post.subreddit}, a community for discussing...</p>
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