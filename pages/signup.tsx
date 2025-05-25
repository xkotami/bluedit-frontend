import Header from '@components/header';
import router from 'next/router';
import React, { useState, useEffect } from 'react';
import userService from '@services/UserService';
import Head from 'next/head';

const Signup: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [usernameError, setUsernameError] = useState<string>('');

    // Function to validate email format
    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

// Function to validate username (you can customize these rules)
    const isValidUsername = (username: string): boolean => {
        // Username should be 3-20 characters, alphanumeric and underscores only
        const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
        return usernameRegex.test(username);
    };

// Function to get username validation message
    const getUsernameValidationMessage = (username: string): string => {
        if (username.length < 3) {
            return 'Username must be at least 3 characters long';
        }
        if (username.length > 20) {
            return 'Username must be no more than 20 characters long';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        return 'Username is valid';
    };

// Function to validate password strength
    const isStrongPassword = (password: string): boolean => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

// Function to get password strength message
    const getPasswordStrengthMessage = (password: string): string => {
        if (password.length < 8) {
            return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])/.test(password)) {
            return 'Password must contain at least one lowercase letter';
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            return 'Password must contain at least one uppercase letter';
        }
        if (!/(?=.*\d)/.test(password)) {
            return 'Password must contain at least one number';
        }
        return 'Password is strong';
    };

    // Real-time username validation
    useEffect(() => {
        if (username) {
            const validationMessage = getUsernameValidationMessage(username);
            if (validationMessage !== 'Username is valid') {
                setUsernameError(validationMessage);
            } else {
                setUsernameError('');
            }
        } else {
            setUsernameError('');
        }
    }, [username]);

    // Real-time email validation
    useEffect(() => {
        if (email && !isValidEmail(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }
    }, [email]);

    // Real-time password validation
    useEffect(() => {
        if (password) {
            const strengthMessage = getPasswordStrengthMessage(password);
            if (strengthMessage !== 'Password is strong') {
                setPasswordError(strengthMessage);
            } else {
                setPasswordError('');
            }
        } else {
            setPasswordError('');
        }
    }, [password]);

    const handleSignup = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError('');

        // Client-side validation
        if (!username.trim()) {
            setError('Please enter a username');
            setLoading(false);
            return;
        }

        if (!isValidUsername(username)) {
            setError('Please enter a valid username');
            setLoading(false);
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address');
            setLoading(false);
            return;
        }

        if (!isStrongPassword(password)) {
            setError('Password does not meet requirements');
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await userService.register({
                username: username.trim(),
                email: email.trim().toLowerCase(),
                password: password
            });
            const userResponse = await response.json();

            if (userResponse) {
                console.log('Signup successful:', userResponse);
                sessionStorage.setItem('user', JSON.stringify(userResponse));
                await router.push('/profile');
            } else {
                setError(userResponse.error || 'Signup failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Signup error:', err);
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

    const errorInputStyle: React.CSSProperties = {
        ...inputStyle,
        borderColor: '#ef4444',
        backgroundColor: '#fef2f2'
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

    const fieldErrorStyle: React.CSSProperties = {
        color: '#ef4444',
        fontSize: '12px',
        marginTop: '5px'
    };

    const mainErrorStyle: React.CSSProperties = {
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

    return (
        <>
            <Head>
                <title>Bluedit | Sign up</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Header />
            <div style={containerStyle}>
                <h1 style={titleStyle}>Create Account</h1>

                <form onSubmit={handleSignup}>
                    <div style={formGroupStyle}>
                        <label htmlFor="username" style={labelStyle}>Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={usernameError ? errorInputStyle : inputStyle}
                            placeholder="Enter your username"
                            required
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, usernameError ? errorInputStyle : inputStyle)} />
                        {usernameError && (
                            <div style={fieldErrorStyle}>
                                {usernameError}
                            </div>
                        )}
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="email" style={labelStyle}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={emailError ? errorInputStyle : inputStyle}
                            placeholder="Enter your email"
                            required
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, emailError ? errorInputStyle : inputStyle)} />
                        {emailError && (
                            <div style={fieldErrorStyle}>
                                {emailError}
                            </div>
                        )}
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="password" style={labelStyle}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={passwordError ? errorInputStyle : inputStyle}
                            placeholder="Enter your password"
                            required
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, passwordError ? errorInputStyle : inputStyle)} />
                        {passwordError && (
                            <div style={fieldErrorStyle}>
                                {passwordError}
                            </div>
                        )}
                    </div>

                    <div style={formGroupStyle}>
                        <label htmlFor="confirmPassword" style={labelStyle}>Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            style={confirmPassword && password !== confirmPassword ? errorInputStyle : inputStyle}
                            placeholder="Confirm your password"
                            required
                            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                            onBlur={(e) => Object.assign(e.target.style, confirmPassword && password !== confirmPassword ? errorInputStyle : inputStyle)} />
                        {confirmPassword && password !== confirmPassword && (
                            <div style={fieldErrorStyle}>
                                Passwords do not match
                            </div>
                        )}
                    </div>

                    {error && (
                        <div style={mainErrorStyle}>
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !!passwordError || !!emailError || !!usernameError}
                        style={loading || !!passwordError || !!emailError || !!usernameError ? disabledButtonStyle : buttonStyle}
                        onMouseEnter={(e) => !loading && !passwordError && !emailError && !usernameError && Object.assign(e.currentTarget.style, buttonHoverStyle)}
                        onMouseLeave={(e) => !loading && !passwordError && !emailError && !usernameError && Object.assign(e.currentTarget.style, buttonStyle)}
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
                            Creating Account...
                        </span>
                        ) : 'Create Account'}
                    </button>
                </form>

                <div style={linkContainerStyle}>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                        Already have an account?{' '}
                        <a href="/login" style={linkStyle}>
                            Sign in here
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

export default Signup;