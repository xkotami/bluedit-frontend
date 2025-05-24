import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@components/header';
import { communityService, isAuthenticated } from 'service/apiService';


const CreateCommunityPage: React.FC = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }
    }, []);

    const validateCommunityName = (name: string): string | null => {
        if (name.length < 3) {
            return 'Community name must be at least 3 characters long';
        }
        if (name.length > 50) {
            return 'Community name must be no more than 50 characters long';
        }
        if (!/^[a-zA-Z0-9_\s]+$/.test(name)) {
            return 'Community name can only contain letters, numbers, underscores, and spaces';
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name.trim() || !description.trim()) {
            setError('Please fill in all fields');
            return;
        }

        const nameValidationError = validateCommunityName(name.trim());
        if (nameValidationError) {
            setError(nameValidationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await communityService.createCommunity(name.trim(), description.trim());
            
            if (result.success && result.data) {
                // Redirect to the created community or communities list
                router.push(`/community`);
            } else {
                setError(result.error || 'Failed to create community');
            }
        } catch (err) {
            setError('Failed to create community');
        } finally {
            setLoading(false);
        }
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '600px',
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
        margin: 0,
        lineHeight: '1.5'
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
        minHeight: '120px',
        resize: 'vertical',
        fontFamily: 'inherit',
        lineHeight: '1.5'
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

    const guidelinesStyle: React.CSSProperties = {
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '24px'
    };

    const guidelinesTitleStyle: React.CSSProperties = {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '8px'
    };

    const guidelinesListStyle: React.CSSProperties = {
        margin: 0,
        paddingLeft: '16px',
        fontSize: '13px',
        color: '#555',
        lineHeight: '1.4'
    };

    const previewStyle: React.CSSProperties = {
        marginTop: '20px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #e9ecef',
        borderRadius: '6px'
    };

    const previewTitleStyle: React.CSSProperties = {
        fontSize: '14px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '12px'
    };

    const previewCardStyle: React.CSSProperties = {
        backgroundColor: 'white',
        border: '1px solid #e1e1e1',
        borderRadius: '6px',
        padding: '16px'
    };

    const previewNameStyle: React.CSSProperties = {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '8px'
    };

    const previewDescStyle: React.CSSProperties = {
        fontSize: '14px',
        color: '#555',
        lineHeight: '1.5'
    };

    return (
        <>
            <Head>
                <title>Create Community | Setback</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            
            <div style={containerStyle}>
                <a href="/community" style={backButtonStyle}>
                    ← Back to Communities
                </a>
                
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Create a New Community</h1>
                    <p style={subtitleStyle}>
                        Build a community around your interests and bring people together
                    </p>
                </div>

                <div style={guidelinesStyle}>
                    <div style={guidelinesTitleStyle}>Community Guidelines</div>
                    <ul style={guidelinesListStyle}>
                        <li>Choose a descriptive and unique name</li>
                        <li>Write a clear description of what your community is about</li>
                        <li>Keep names family-friendly and respectful</li>
                        <li>Avoid names that are too similar to existing communities</li>
                    </ul>
                </div>

                {error && (
                    <div style={errorStyle}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={formGroupStyle}>
                        <label htmlFor="name" style={labelStyle}>
                            Community Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Web Development, Gaming, Photography..."
                            style={inputStyle}
                            maxLength={50}
                            required
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                        />
                        <div style={characterCountStyle}>
                            {name.length}/50 characters
                        </div>
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="description" style={labelStyle}>
                            Description *
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what your community is about, what kind of content should be shared, and what discussions are welcome..."
                            style={textareaStyle}
                            maxLength={500}
                            required
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, textareaStyle)}
                        />
                        <div style={characterCountStyle}>
                            {description.length}/500 characters
                        </div>
                    </div>

                    {(name.trim() || description.trim()) && (
                        <div style={previewStyle}>
                            <div style={previewTitleStyle}>Preview</div>
                            <div style={previewCardStyle}>
                                <div style={previewNameStyle}>
                                    r/{name.trim() || 'Community Name'}
                                </div>
                                <div style={previewDescStyle}>
                                    {description.trim() || 'Community description will appear here...'}
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !name.trim() || !description.trim()}
                        style={loading || !name.trim() || !description.trim() ? disabledButtonStyle : buttonStyle}
                        onMouseEnter={(e) => !loading && name.trim() && description.trim() && Object.assign(e.currentTarget.style, buttonHoverStyle)}
                        onMouseLeave={(e) => !loading && name.trim() && description.trim() && Object.assign(e.currentTarget.style, buttonStyle)}
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
                                Creating Community...
                            </span>
                        ) : 'Create Community'}
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

export default CreateCommunityPage;