import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from 'service/userService';
import Header from '@components/header';

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const router = useRouter();

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await loginUser(email, password);

            if (result.success) {
                router.push('/profile');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    const containerStyle: React.CSSProperties = {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '40px',
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    };

    const titleStyle: React.CSSProperties = {
        textAlign: 'center',
        marginBottom: '30px',
        color: '#1a1a1a',
        fontSize: '28px',
        fontWeight: '600',
        letterSpacing: '-0.5px'
    };

    const formGroupStyle: React.CSSProperties = {
        marginBottom: '24px'
    };

    const labelStyle: React.CSSProperties = {
        display: 'block',
        marginBottom: '8px',
        fontWeight: '500',
        color: '#374151',
        fontSize: '14px'
    };

    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '12px 16px',
        border: '2px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
        outline: 'none',
        backgroundColor: '#fafafa'
    };

    const inputFocusStyle: React.CSSProperties = {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        backgroundColor: '#fff'
    };

    const buttonStyle: React.CSSProperties = {
        width: '100%',
        padding: '14px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)'
    };

    const buttonHoverStyle: React.CSSProperties = {
        backgroundColor: '#2563eb',
        transform: 'translateY(-1px)',
        boxShadow: '0 4px 8px rgba(59, 130, 246, 0.3)'
    };

    const disabledButtonStyle: React.CSSProperties = {
        ...buttonStyle,
        backgroundColor: '#9ca3af',
        cursor: 'not-allowed',
        transform: 'none',
        boxShadow: 'none'
    };

    const errorStyle: React.CSSProperties = {
        color: '#ef4444',
        backgroundColor: '#fef2f2',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
        fontSize: '14px',
        border: '1px solid #fecaca'
    };

    const linkContainerStyle: React.CSSProperties = {
        textAlign: 'center',
        marginTop: '24px',
        padding: '20px 0',
        borderTop: '1px solid #e5e7eb'
    };

    const linkStyle: React.CSSProperties = {
        color: '#3b82f6',
        textDecoration: 'none',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'color 0.2s ease'
    };

    const forgotPasswordStyle: React.CSSProperties = {
        textAlign: 'center',
        marginTop: '16px'
    };

    return (

        <><Header />
        
        <div style={containerStyle}>

            <h1 style={titleStyle}>Welcome Back</h1>

            <form onSubmit={handleLogin}>
                <div style={formGroupStyle}>
                    <label htmlFor="email" style={labelStyle}>E-mail</label>
                    <input
                        type="text"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={inputStyle}
                        placeholder="Enter your email"
                        required
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
                </div>

                <div style={formGroupStyle}>
                    <label htmlFor="password" style={labelStyle}>Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={inputStyle}
                        placeholder="Enter your password"
                        required
                        onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                        onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
                </div>

                {error && (
                    <div style={errorStyle}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    style={loading ? disabledButtonStyle : buttonStyle}
                    onMouseEnter={(e) => !loading && Object.assign(e.currentTarget.style, buttonHoverStyle)}
                    onMouseLeave={(e) => !loading && Object.assign(e.currentTarget.style, buttonStyle)}
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
                            Signing in...
                        </span>
                    ) : 'Sign In'}
                </button>
            </form>

            <div style={forgotPasswordStyle}>
                <a href="/forgot-password" style={linkStyle}>
                    Forgot your password?
                </a>
            </div>

            <div style={linkContainerStyle}>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    Don't have an account?{' '}
                    <a href="/signup" style={linkStyle}>
                        Sign up here
                    </a>
                </p>
            </div>

            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div></>
    );
};

export default Login;