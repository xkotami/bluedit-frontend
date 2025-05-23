// loginService.ts

interface LoginResponse {
    token: string;
    email: string;
    id: string;
}

interface LoginResult {
    success: boolean;
    data?: LoginResponse;
    error?: string;
}

interface AuthData {
    token: string | null;
    email: string | null;
    userId: string | null;
}

const API_BASE_URL = 'http://localhost:3000'; // Replace with your backend URL

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
    try {
        const response = await fetch(`${API_BASE_URL}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        // Check if response is ok
        if (!response.ok) {
            const errorData = await response.json();
            console.log('Backend error:', errorData); // Debug log
            
            // Handle both route-level and service-level errors
            if (response.status === 500) {
                // Backend throws 500 for all errors, check the message
                if (errorData.message === 'ERROR_USER_NOT_FOUND') {
                    throw new Error('User not found');
                } else if (errorData.message === 'ERROR_INVALID_CREDENTIALS') {
                    throw new Error('Invalid email or password');
                } else {
                    throw new Error(errorData.message || 'Login failed');
                }
            } else if (response.status === 401) {
                throw new Error('Invalid credentials');
            } else if (response.status === 404) {
                throw new Error('User not found');
            } else {
                throw new Error(errorData.message || 'Login failed');
            }
        }

        const data: LoginResponse = await response.json();
        
        // Store token in localStorage (optional)
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
        console.error('Login error:', error);
        
        // Handle specific backend errors
        let errorMessage = 'An error occurred during login';
        
        if (error instanceof Error) {
            if (error.message.includes('ERROR_USER_NOT_FOUND')) {
                errorMessage = 'User not found';
            } else if (error.message.includes('ERROR_INVALID_CREDENTIALS')) {
                errorMessage = 'Invalid email or password';
            } else if (error.message.includes('User not found')) {
                errorMessage = 'User not found';
            } else if (error.message.includes('Invalid')) {
                errorMessage = 'Invalid email or password';
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

// Optional: Function to get stored auth data
export const getAuthData = (): AuthData => {
    return {
        token: localStorage.getItem('authToken'),
        email: localStorage.getItem('userEmail'),
        userId: localStorage.getItem('userId')
    };
};

// Optional: Function to clear auth data (for logout)
export const clearAuthData = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
};

// Optional: Function to check if user is authenticated
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