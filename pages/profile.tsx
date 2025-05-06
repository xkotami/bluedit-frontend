import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/profile.module.css';

interface Post {
    id: number;
    title: string;
    subreddit: string;
    upvotes: string;
    comments: string;
    timePosted: string;
    content: string;
}

const Profile: React.FC = () => {
    const user = {
        username: 'firstBlueditUser',
        reputationPoints: '15.2k',
        accountAge: '2 years',
        followers: '1.4k',
        following: '256',
        about: 'AHAHAHHAAHAHHAHAHHA',
    };

    const posts: Post[] = [
        {
            id: 1,
            title: 'My first post on this platform!',
            subreddit: 'r/programming',
            upvotes: '1.2k',
            comments: '243',
            timePosted: '5 hours ago',
            content: 'Just wanted to share my experience with this new platform...'
        },
        {
            id: 2,
            title: 'Interesting fact I learned today',
            subreddit: 'r/todayilearned',
            upvotes: '5.7k',
            comments: '421',
            timePosted: '1 day ago',
            content: 'Did you know that honey never spoils? Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly good to eat!'
        }
    ];

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
                                <span className={styles.statNumber}>{user.reputationPoints}</span>
                                <span className={styles.statLabel}>Reputation</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{user.accountAge}</span>
                                <span className={styles.statLabel}>Member since</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{user.followers}</span>
                                <span className={styles.statLabel}>Followers</span>
                            </div>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>{user.following}</span>
                                <span className={styles.statLabel}>Following</span>
                            </div>
                        </div>
                        <div className={styles.about}>
                            <h3>About</h3>
                            <p>{user.about}</p>
                        </div>
                        <button className={styles.followButton}>Follow</button>
                    </div>
                </div>

                <div className={styles.tabs}>
                    <button className={`${styles.tab} ${styles.active}`}>Posts</button>
                    <button className={styles.tab}>Comments</button>
                    <button className={styles.tab}>Saved</button>
                    <button className={styles.tab}>Upvoted</button>
                    <button className={styles.tab}>Downvoted</button>
                </div>

                <div className={styles.postsContainer}>
                    {posts.map(post => (
                        <div key={post.id} className={styles.post}>
                            <div className={styles.postHeader}>
                                <span className={styles.subreddit}>{post.subreddit}</span>
                                <span className={styles.dot}>•</span>
                                <span className={styles.time}>Posted by u/{user.username} {post.timePosted}</span>
                            </div>
                            <h3 className={styles.postTitle}>{post.title}</h3>
                            <p className={styles.postContent}>{post.content}</p>
                            <div className={styles.postStats}>
                                <span className={styles.upvotes}>▲ {post.upvotes}</span>
                                <span className={styles.comments}>💬 {post.comments} comments</span>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </>
    );
};

export default Profile;