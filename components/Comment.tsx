import React from 'react';
import styles from '@styles/postDetail.module.css';
import { Comment } from '@types';

interface CommentProps {
    comment: Comment;
    depth: number;
    showReplyForms: { [key: number]: boolean };
    replyTexts: { [key: number]: string };
    replyingTo: number | null;
    userData: any;
    id: string | string[];
    toggleReplyForm: (commentId: number) => void;
    setReplyTexts: React.Dispatch<React.SetStateAction<{ [key: number]: string }>>;
    handleCreateReply: (parentCommentId: number, postId: number) => Promise<void>;
    formatTimeAgo: (date: Date | string) => string;
}

const CommentComponent: React.FC<CommentProps> = ({
                                                      comment,
                                                      depth,
                                                      showReplyForms,
                                                      replyTexts,
                                                      replyingTo,
                                                      userData,
                                                      id,
                                                      toggleReplyForm,
                                                      setReplyTexts,
                                                      handleCreateReply,
                                                      formatTimeAgo,
                                                  }) => {
    return (
        <div className={comment.parent ? styles.commentThread : ""} style={{ marginLeft: `${Math.min(depth * 20, 100)}px` }}>
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

                    {showReplyForms[comment.id!] && (
                        <div className={styles.replyForm}>
                            <textarea
                                value={replyTexts[comment.id!] || ''}
                                onChange={(e) =>
                                    setReplyTexts(prev => ({
                                        ...prev,
                                        [comment.id!]: e.target.value,
                                    }))
                                }
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

            {comment.replies &&
                comment.replies.length > 0 &&
                comment.replies.map(reply => (
                    <CommentComponent
                        key={reply.id}
                        comment={reply}
                        depth={depth + 1}
                        showReplyForms={showReplyForms}
                        replyTexts={replyTexts}
                        replyingTo={replyingTo}
                        userData={userData}
                        id={id}
                        toggleReplyForm={toggleReplyForm}
                        setReplyTexts={setReplyTexts}
                        handleCreateReply={handleCreateReply}
                        formatTimeAgo={formatTimeAgo}
                    />
                ))}
        </div>
    );
};

export default CommentComponent;
