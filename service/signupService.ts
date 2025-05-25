// signupService.ts

interface SignupRequest {
    username: string;
    email: string;
    password: string;
}

interface SignupResponse {
    token: string;
    email: string;
    id: string;
}

interface SignupResult {
    success: boolean;
    data?: SignupResponse;
    error?: string;
}

interface AuthData {
    token: string | null;
    email: string | null;
    userId: string | null;
}



export const signupUser = async (signupData: SignupRequest): Promise<SignupResult> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(signupData)
        });

        // Check if response is ok
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Signup failed');
        }

        const data: SignupResponse = await response.json();
        
        // Store token in localStorage (optional - auto-login after signup)
        if (data.token) {
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userEmail', data.email);
            localStorage.setItem('userId', data.id);
        }

        return {
            success: true,
            data: {
                token: data.token,
                email: data.email,
                id: data.id
            }
        };

    } catch (error) {
        console.error('Signup error:', error);
        
        // Handle specific backend errors
        let errorMessage = 'An error occurred during signup';
        
        if (error instanceof Error) {
            if (error.message.includes('ERROR_USER_EXISTS')) {
                errorMessage = 'User with this email or username already exists';
            } else if (error.message.includes('ERROR_INVALID_EMAIL')) {
                errorMessage = 'Please enter a valid email address';
            } else if (error.message.includes('ERROR_WEAK_PASSWORD')) {
                errorMessage = 'Password is too weak. Please choose a stronger password';
            } else if (error.message.includes('ERROR_VALIDATION')) {
                errorMessage = 'Please check your input and try again';
            } else if (error.message) {
                errorMessage = error.message;
            }
        }

        return {
            success: false,
            error: errorMessage
        };
    }
};

// Function to validate email format
export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Function to validate username (you can customize these rules)
export const isValidUsername = (username: string): boolean => {
    // Username should be 3-20 characters, alphanumeric and underscores only
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
};

// Function to get username validation message
export const getUsernameValidationMessage = (username: string): string => {
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
export const isStrongPassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

// Function to get password strength message
export const getPasswordStrengthMessage = (password: string): string => {
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

// Function to get stored auth data
export const getAuthData = (): AuthData => {
    return {
        token: localStorage.getItem('authToken'),
        email: localStorage.getItem('userEmail'),
        userId: localStorage.getItem('userId')
    };
};

// Function to clear auth data (for logout)
export const clearAuthData = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('authToken');
};

// For authenticated requests
export const authenticatedFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const token = localStorage.getItem('authToken');
    
    return fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });
};