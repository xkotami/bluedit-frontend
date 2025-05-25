import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import { useUser } from '../../hooks/useUser';
import communityService from '@services/CommunityService';
import postService from '@services/PostService';
import { Community } from '@types';

const CreatePostPage: React.FC = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
    const [communities, setCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [communitiesLoading, setCommunitiesLoading] = useState(true);
    const router = useRouter();
    const { userData, isUserLoading, userError } = useUser();

    useEffect(() => {
        if (userError) {
            setError(userError);
        }
        else {
            loadUserCommunities();
        }
    }, [userData]);

    useEffect(() => {
        if (!userData) {
            router.push('/login');
            return;
        }
        loadUserCommunities();
    }, [userData]);

    const loadUserCommunities = async () => {
        if (!userData) return;
        try {
            const response = await communityService.getCommunitiesOfUser(userData.token);
            const communityResponse = await response.json();
            if (communityResponse) {
                setCommunities(communityResponse);
                if (communityResponse.length > 0) {
                    setSelectedCommunityId(communityResponse[0].id!);
                }
            } else {
                setError('Failed to load your communities');
            }
        } catch (err) {
            setError('Failed to load your communities');
        } finally {
            setCommunitiesLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        if (!userData) return;
        e.preventDefault();

        if (!title.trim() || !content.trim() || !selectedCommunityId) {
            setError('Please fill in all fields and select a community');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const postInput = {
                title: title.trim(),
                content: content.trim(),
                userId: userData.id,
                communityId: selectedCommunityId
            }

            const response = await postService.createPost(postInput, userData.token);
            const postResponse = await response.json();

            if (postResponse) {
                // Redirect to the created post
                await router.push(`/posts/${postResponse.id}`);
            } else {
                setError(postResponse.error || 'Failed to create post');
            }
        } catch (err) {
            setError('Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '700px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };

    const headerStyle: React.CSSProperties = {
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e1e1e1'
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a1a',
        marginBottom: '8px'
    };

    const subtitleStyle: React.CSSProperties = {
        fontSize: '16px',
        color: '#666',
        margin: 0
    };

    const formStyle: React.CSSProperties = {
        backgroundColor: 'white',
        border: '1px solid #e1e1e1',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    };

    const formGroupStyle: React.CSSProperties = {
        marginBottom: '24px'
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '600',
        color: '#333',
        fontSize: '14px'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e1e1e1',
        borderRadius: '6px',
        fontSize: '16px',
        fontFamily: 'inherit',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        boxSizing: 'border-box',
        outline: 'none'
    };

    const inputFocusStyle: React.CSSProperties = {
        borderColor: '#007bff',
        boxShadow: '0 0 0 3px rgba(0, 123, 255, 0.1)'
    };

    const textareaStyle: React.CSSProperties = {
        ...inputStyle,
        minHeight: '140px',
        resize: 'vertical',
        fontFamily: 'inherit',
        lineHeight: '1.5'
    };

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
        cursor: 'pointer'
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease'
    };

    const buttonHoverStyle: React.CSSProperties = {
        backgroundColor: '#0056b3'
    };

    const disabledButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#6c757d',
        cursor: 'not-allowed'
    };

    const errorStyle: React.CSSProperties = {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px 16px',
        borderRadius: '6px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb',
        fontSize: '14px'
    };

    const backButtonStyle: React.CSSProperties = {
        backgroundColor: 'transparent',
        color: '#007bff',
        border: '1px solid #007bff',
        borderRadius: '6px',
        padding: '8px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        marginBottom: '20px',
        textDecoration: 'none',
        display: 'inline-block',
        transition: 'all 0.2s ease'
    };

    const characterCountStyle: React.CSSProperties = {
        fontSize: '12px',
        color: '#666',
        marginTop: '4px',
        textAlign: 'right'
    };

    const loadingContainerStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '60px',
        color: '#666'
    };

    const noCommunitiesStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '40px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '8px'
    };

    if (communitiesLoading) {
        return (
            <>
                <Head>
                    <title>Create Post | Bluedit</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Header />
                <div style={containerStyle}>
                    <div style={loadingContainerStyle}>
                        <div>Loading your communities...</div>
                    </div>
                </div>
            </>
        );
    }

    if (communities.length === 0) {
        return (
            <>
                <Head>
                    <title>Create Post | Bluedit</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                </Head>
                <Header />
                <div style={containerStyle}>
                    <div style={noCommunitiesStyle}>
                        <h3>No Communities Found</h3>
                        <p>You need to join at least one community before creating a post.</p>
                        <a href="/community" style={backButtonStyle}>
                            Browse Communities
                        </a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>Create Post | Bluedit</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />

            <div style={containerStyle}>
                <a href="/community" style={backButtonStyle}>
                    ← Back to Communities
                </a>

                <div style={headerStyle}>
                    <h1 style={titleStyle}>Create a New Post</h1>
                    <p style={subtitleStyle}>Share your thoughts, ask questions, or start a discussion</p>
                </div>

                {error && (
                    <div style={errorStyle}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={formGroupStyle}>
                        <label htmlFor="community" style={labelStyle}>
                            Community *
                        </label>
                        <select
                            id="community"
                            value={selectedCommunityId || ''}
                            onChange={(e) => setSelectedCommunityId(Number(e.target.value))}
                            style={selectStyle}
                            required
                        >
                            <option value="">Select a community</option>
                            {communities.map((community) => (
                                <option key={community.id} value={community.id}>
                                    r/{community.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="title" style={labelStyle}>
                            Title *
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="An interesting title..."
                            style={inputStyle}
                            maxLength={300}
                            required
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                        />
                        <div style={characterCountStyle}>
                            {title.length}/300 characters
                        </div>
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="content" style={labelStyle}>
                            Content *
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="What would you like to share? Tell your story, ask a question, start a discussion..."
                            style={textareaStyle}
                            maxLength={10000}
                            required
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, textareaStyle)}
                        />
                        <div style={characterCountStyle}>
                            {content.length}/10,000 characters
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !title.trim() || !content.trim() || !selectedCommunityId}
                        style={loading || !title.trim() || !content.trim() || !selectedCommunityId ? disabledButtonStyle : buttonStyle}
                        onMouseEnter={(e) => !loading && title.trim() && content.trim() && selectedCommunityId && Object.assign(e.currentTarget.style, buttonHoverStyle)}
                        onMouseLeave={(e) => !loading && title.trim() && content.trim() && selectedCommunityId && Object.assign(e.currentTarget.style, buttonStyle)}
                    >
                        {loading ? (
                            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid #ffffff40',
                                    borderTop: '2px solid #ffffff',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></span>
                                Creating Post...
                            </span>
                        ) : 'Create Post'}
                    </button>
                </form>

                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </>
    );
};

export default CreatePostPage;