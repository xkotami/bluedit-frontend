import Head from 'next/head';
import Header from '@components/header';
import Post from '@components/post';
import styles from '@styles/home.module.css';

interface PostData {
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
}

const Home: React.FC = () => {
    const posts: PostData[] = [
        {
            id: 1,
            title: 'Just adopted this cute puppy!',
            author: 'dog_lover42',
            subreddit: 'aww',
            upvotes: '1.2K',
            commentsCount: '243',
            timePosted: '5 hours ago',
            content: {
                type: 'image',
                url: '/placeholder-puppy.jpg'
            }
        },
        {
            id: 2,
            title: 'What do you think about the new JavaScript framework?',
            author: 'dev_guy',
            subreddit: 'programming',
            upvotes: '892',
            commentsCount: '421',
            timePosted: '8 hours ago',
            content: {
                type: 'text',
                text: 'I\'ve been exploring the new framework and it seems promising.'
            }
        }
    ];

    return (
        <>
            <Head>
                <title>Setback | Home</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            <main className={styles.mainContainer}>
                <div className={styles.content}>
                    <aside className={styles.leftSidebar}>
                        <div className={styles.communitiesSection}>
                            <h3>Top Communities</h3>
                            <ul className={styles.communityList}>
                                <li>r/AskReddit</li>
                                <li>r/WorldNews</li>
                                <li>r/Technology</li>
                                <li>r/Gaming</li>
                                <li>r/Movies</li>
                            </ul>
                        </div>
                    </aside>

                    <section className={styles.postsFeed}>
                        <div className={styles.createPostCard}>
                            <div className={styles.userAvatar}>
                                <span>👤</span>
                            </div>
                            <input
                                type="text"
                                placeholder="Create Post"
                                className={styles.createPostInput}
                            />
                            <button className={styles.mediaButton}>📷</button>
                        </div>

                        <div className={styles.postsList}>
                            {posts.map(post => (
                                <Post key={post.id} post={post} />
                            ))}
                        </div>
                    </section>

                    <aside className={styles.rightSidebar}>
                        <div className={styles.aboutCard}>
                            <h3>About Setback</h3>
                            <p>Welcome to Setback, a Reddit-inspired platform for sharing and discussing content.</p>
                            <button className={styles.joinButton}>Join</button>
                        </div>

                        <div className={styles.trendingCard}>
                            <h3>Trending Today</h3>
                            <ol className={styles.trendingList}>
                                <li>#NewMovieRelease</li>
                                <li>#TechConference2023</li>
                                <li>#ScienceDiscovery</li>
                                <li>#GamingNews</li>
                                <li>#AMA</li>
                            </ol>
                        </div>
                    </aside>
                </div>
            </main>
        </>
    );
};

export default Home;