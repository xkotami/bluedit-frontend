// services/apiService.ts

const API_BASE_URL = 'http://localhost:3000'; // Replace with your backend URL

// Types (matching your backend)
interface User {
    id?: number;
    username: string;
    email: string;
    points: number;
    password: string;
}

interface Post {
    id?: number;
    title: string;
    content: string;
    user: User;
    comments: Comment[];
    createdAt: Date;
}

interface Community {
    id?: number;
    posts: Post[];
    users: User[];
    name: string;
    description: string;
    createdAt: Date;
}

interface Comment {
    id?: number;
    text: string;
    createdAt: Date;
    points: number;
    createdBy: User;
    parent?: Comment;
    replies: Comment[];
}

interface CommentInput {
    text: string;
    userId?: number;
    postId: number;
}

interface ReplyInput {
    text: string;
    userId: number;
    postId: number;
    parentId: number;
}

interface PostInput {
    title: string;
    content: string;
    userId: number;
    communityId: number;
}

interface CommunityInput {
    name: string;
    description: string;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

// Auth utilities
export const getAuthToken = (): string | null => {
    return localStorage.getItem('authToken');
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

export const clearAuthData = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
};

// Generic API call with auth
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const token = getAuthToken();
    
    return fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });
};

// USER SERVICES
export const userService = {
    // Login user
    login: async (email: string, password: string): Promise<ApiResponse<{token: string; email: string; id: string}>> => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Backend login error:', errorData); // Debug log
                
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

            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('userId', data.id);
            }

            return { success: true, data };
        } catch (error) {
            let errorMessage = 'Login failed';
            
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

            return { success: false, error: errorMessage };
        }
    },

    // Register user
    register: async (username: string, email: string, password: string): Promise<ApiResponse<{token: string; email: string; id: string}>> => {
        try {
            const response = await fetch(`${API_BASE_URL}/user/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.log('Backend register error:', errorData); // Debug log
                
                // Handle both route-level and service-level errors
                if (response.status === 400) {
                    throw new Error(errorData.message || 'User already exists');
                } else if (response.status === 500) {
                    // Backend might throw 500 for user exists error
                    if (errorData.message === 'ERROR_USER_EXISTS') {
                        throw new Error('User with this email or username already exists');
                    } else {
                        throw new Error(errorData.message || 'Registration failed');
                    }
                } else {
                    throw new Error(errorData.message || 'Registration failed');
                }
            }

            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userEmail', data.email);
                localStorage.setItem('userId', data.id);
            }

            return { success: true, data };
        } catch (error) {
            let errorMessage = 'Registration failed';
            
            if (error instanceof Error) {
                if (error.message.includes('ERROR_USER_EXISTS')) {
                    errorMessage = 'User with this email or username already exists';
                } else if (error.message.includes('User with this email or username already exists')) {
                    errorMessage = 'User with this email or username already exists';
                } else if (error.message.includes('User already exists')) {
                    errorMessage = 'User with this email or username already exists';
                } else if (error.message.includes('ERROR_INVALID_EMAIL')) {
                    errorMessage = 'Please enter a valid email address';
                } else if (error.message) {
                    errorMessage = error.message;
                }
            }

            return { success: false, error: errorMessage };
        }
    },

    // Get all users
    getAllUsers: async (): Promise<ApiResponse<User[]>> => {
        try {
            const response = await apiCall('/user');
            
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch users' 
            };
        }
    },

    // Get user by ID
    getUserById: async (id: number): Promise<ApiResponse<User>> => {
        try {
            const response = await apiCall(`/user/${id}`);
            
            if (!response.ok) {
                throw new Error('User not found');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'User not found' 
            };
        }
    },
};

// COMMUNITY SERVICES
export const communityService = {
    // Get all communities
    getAllCommunities: async (): Promise<ApiResponse<Community[]>> => {
        try {
            const response = await apiCall('/community');
            
            if (!response.ok) {
                throw new Error('Failed to fetch communities');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch communities' 
            };
        }
    },

    // Get community by ID
    getCommunityById: async (id: number): Promise<ApiResponse<Community>> => {
        try {
            const response = await apiCall(`/community/${id}`);
            
            if (!response.ok) {
                throw new Error('Community not found');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Community not found' 
            };
        }
    },

    // Create community
    createCommunity: async (name: string, description: string): Promise<ApiResponse<Community>> => {
        try {
            const response = await apiCall('/community', {
                method: 'POST',
                body: JSON.stringify({ name, description }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create community');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to create community' 
            };
        }
    },

    // Get user's joined communities
    getUserCommunities: async (): Promise<ApiResponse<Community[]>> => {
        try {
            const response = await apiCall('/community/user');
            
            if (!response.ok) {
                throw new Error('Failed to fetch user communities');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch user communities' 
            };
        }
    },

    // Join community
    joinCommunity: async (communityId: number): Promise<ApiResponse<Community>> => {
        try {
            const response = await apiCall(`/community/join/${communityId}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to join community');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to join community' 
            };
        }
    },

    // Leave community
    leaveCommunity: async (communityId: number): Promise<ApiResponse<Community>> => {
        try {
            const response = await apiCall(`/community/leave/${communityId}`, {
                method: 'PUT',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to leave community');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to leave community' 
            };
        }
    },
};

// POST SERVICES
export const postService = {
    // Get all posts
    getAllPosts: async (): Promise<ApiResponse<Post[]>> => {
        try {
            const response = await apiCall('/posts');
            
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch posts' 
            };
        }
    },

    // Get post by ID
    getPostById: async (id: string): Promise<ApiResponse<Post>> => {
        try {
            const response = await apiCall(`/posts/${id}`);
            
            if (!response.ok) {
                throw new Error('Post not found');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Post not found' 
            };
        }
    },

    // Get posts by community
    getPostsByCommunity: async (communityId: string): Promise<ApiResponse<Post[]>> => {
        try {
            const response = await apiCall(`/communities/${communityId}/posts`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch community posts');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch community posts' 
            };
        }
    },

    // Create post
    createPost: async (title: string, content: string, communityId: number): Promise<ApiResponse<Post>> => {
        try {
            const response = await apiCall('/posts', {
                method: 'POST',
                body: JSON.stringify({ title, content, communityId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to create post' 
            };
        }
    },
};

// COMMENT SERVICES
export const commentService = {
    // Get comments by post
    getCommentsByPost: async (postId: number): Promise<ApiResponse<Comment[]>> => {
        try {
            const response = await apiCall(`/posts/${postId}/comments`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch comments');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch comments' 
            };
        }
    },

    // Create comment
    createComment: async (text: string, postId: number): Promise<ApiResponse<Comment>> => {
        try {
            const response = await apiCall('/comments', {
                method: 'POST',
                body: JSON.stringify({ text, postId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create comment');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to create comment' 
            };
        }
    },

    // Create reply
    createReply: async (text: string, postId: number, parentId: number): Promise<ApiResponse<Comment>> => {
        try {
            const response = await apiCall('/comments/reply', {
                method: 'POST',
                body: JSON.stringify({ text, postId, parentId }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create reply');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to create reply' 
            };
        }
    },

    // Get user's comments
    getUserComments: async (userId: number): Promise<ApiResponse<Comment[]>> => {
        try {
            const response = await apiCall(`/users/${userId}/comments`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch user comments');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error instanceof Error ? error.message : 'Failed to fetch user comments' 
            };
        }
    },
};