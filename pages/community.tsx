import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from 'service/userService';
import { communityService } from 'service/apiService';
import Header from '@components/header';


interface Community {
    id?: number;
    name: string;
    description: string;
    posts: any[];
    users: any[];
    createdAt: Date;
}

const CommunityListPage: React.FC = () => {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [userCommunities, setUserCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [joinLoading, setJoinLoading] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadCommunities();
        if (isAuthenticated()) {
            loadUserCommunities();
        }
    }, []);

    const loadCommunities = async () => {
        try {
            const result = await communityService.getAllCommunities();
            if (result.success && result.data) {
                setCommunities(result.data);
            } else {
                setError('Failed to load communities');
            }
        } catch (err) {
            setError('Failed to load communities');
        } finally {
            setLoading(false);
        }
    };

    const loadUserCommunities = async () => {
        try {
            const result = await communityService.getUserCommunities();
            if (result.success && result.data) {
                setUserCommunities(result.data);
            }
        } catch (err) {
            console.error('Failed to load user communities:', err);
        }
    };

    const handleJoinCommunity = async (communityId: number) => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        setJoinLoading(communityId);
        try {
            const result = await communityService.joinCommunity(communityId);
            if (result.success) {
                await loadUserCommunities(); // Refresh user communities
                setError('');
            } else {
                setError(result.error || 'Failed to join community');
            }
        } catch (err) {
            setError('Failed to join community');
        } finally {
            setJoinLoading(null);
        }
    };

    const handleLeaveCommunity = async (communityId: number) => {
        setJoinLoading(communityId);
        try {
            const result = await communityService.leaveCommunity(communityId);
            if (result.success) {
                await loadUserCommunities(); // Refresh user communities
                setError('');
            } else {
                setError(result.error || 'Failed to leave community');
            }
        } catch (err) {
            setError('Failed to leave community');
        } finally {
            setJoinLoading(null);
        }
    };

    const isUserInCommunity = (communityId: number): boolean => {
        return userCommunities.some(community => community.id === communityId);
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    };

    const headerStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '20px',
        borderBottom: '1px solid #e1e1e1'
    };

    const titleStyle: React.CSSProperties = {
        fontSize: '32px',
        fontWeight: '700',
        color: '#1a1a1a',
        margin: 0
    };

    const createButtonStyle: React.CSSProperties = {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '10px 20px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'inline-block'
    };

    const communityCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        border: '1px solid #e1e1e1',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '16px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'box-shadow 0.2s ease'
    };

    const communityHeaderStyle: React.CSSProperties = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '12px'
    };

    const communityNameStyle: React.CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '4px',
        cursor: 'pointer',
        textDecoration: 'none'
    };

    const communityStatsStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#666',
        marginBottom: '8px'
    };

    const communityDescStyle: React.CSSProperties = {
        color: '#555',
        lineHeight: '1.5',
        marginBottom: '0'
    };

    const joinButtonStyle: React.CSSProperties = {
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    };

    const leaveButtonStyle: React.CSSProperties = {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        padding: '8px 16px',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer'
    };

    const disabledButtonStyle: React.CSSProperties = {
        backgroundColor: '#ccc',
        cursor: 'not-allowed'
    };

    const errorStyle: React.CSSProperties = {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '12px',
        borderRadius: '4px',
        marginBottom: '20px',
        border: '1px solid #f5c6cb'
    };

    const loadingStyle: React.CSSProperties = {
        textAlign: 'center',
        padding: '40px',
        fontSize: '18px',
        color: '#666'
    };

    if (loading) {
        return (
            <div style={containerStyle}>
                <div style={loadingStyle}>Loading communities...</div>
            </div>
        );
    }

    return (
        <><Header />
        <div style={containerStyle}>
            <div style={headerStyle}>
                <h1 style={titleStyle}>Communities</h1>
                {isAuthenticated() && (
                    <a href="/communities/create" style={createButtonStyle}>
                        Create Community
                    </a>
                )}
            </div>

            {error && (
                <div style={errorStyle}>
                    {error}
                </div>
            )}

            <div>
                {communities.map((community) => (
                    <div key={community.id} style={communityCardStyle}>
                        <div style={communityHeaderStyle}>
                            <div style={{ flex: 1 }}>
                                <div
                                    style={communityNameStyle}
                                    onClick={() => router.push(`/communities/${community.id}`)}
                                >
                                    r/{community.name}
                                </div>
                                <div style={communityStatsStyle}>
                                    {community.users?.length || 0} members • {community.posts?.length || 0} posts
                                </div>
                                <p style={communityDescStyle}>
                                    {community.description}
                                </p>
                            </div>

                            {isAuthenticated() && (
                                <div>
                                    {isUserInCommunity(community.id!) ? (
                                        <button
                                            style={{
                                                ...leaveButtonStyle,
                                                ...(joinLoading === community.id ? disabledButtonStyle : {})
                                            }}
                                            onClick={() => handleLeaveCommunity(community.id!)}
                                            disabled={joinLoading === community.id}
                                        >
                                            {joinLoading === community.id ? 'Leaving...' : 'Leave'}
                                        </button>
                                    ) : (
                                        <button
                                            style={{
                                                ...joinButtonStyle,
                                                ...(joinLoading === community.id ? disabledButtonStyle : {})
                                            }}
                                            onClick={() => handleJoinCommunity(community.id!)}
                                            disabled={joinLoading === community.id}
                                        >
                                            {joinLoading === community.id ? 'Joining...' : 'Join'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {communities.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        No communities found. {isAuthenticated() && 'Create the first one!'}
                    </div>
                )}
            </div>
        </div></>
    );
};

export default CommunityListPage;