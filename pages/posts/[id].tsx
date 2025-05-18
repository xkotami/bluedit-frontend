import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import styles from '@styles/postDetail.module.css';
import { useEffect, useState } from 'react';
import { Post, Comment, Community } from '@types';
import postService from '@services/PostService';
import communityService from '@services/CommunityService';

const PostDetail = () => {
    const [post, setPost] = useState<Post | null>(null);
    const [community, setCommunity] = useState<Community | null>(null);
    const router = useRouter();
    const { id } = router.query;

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
        fetchPost();
        fetchCommunity();
    }, [id]);

    if (!post) return <div>Loading...</div>;

    return (
        <>
            <Head>
                <title>Post by {post.user.username} | Bluedit</title>
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

                            {post.content && (
                                <div className={styles.postText}>
                                    {post.content.split('\n').map((paragraph, index) => (
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
                                    <span
                                        className={styles.statLabel}>{community.users.length == 1 ? "Member" : "Members"}</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statNumber}>{community.posts.length}</span>
                                    <span
                                        className={styles.statLabel}>{community.posts.length == 1 ? "Post" : "Posts"}</span>
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