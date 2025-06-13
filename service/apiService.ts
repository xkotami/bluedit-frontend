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
    userId: number;
    postId: number;
    parentId?: number; // For replies
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

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

// Auth utilities - Note: These use localStorage which won't work in Claude artifacts
// In production, consider using proper state management
export const getAuthToken = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('authToken');
    }
    return null;
};

export const isAuthenticated = (): boolean => {
    return !!getAuthToken();
};

export const clearAuthData = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userId');
    }
};

export const getCurrentUserId = (): number | null => {
    if (typeof window !== 'undefined') {
        const userId = localStorage.getItem('userId');
        return userId ? parseInt(userId) : null;
    }
    return null;
};

// Generic API call with auth
const apiCall = async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
    const token = getAuthToken();

    return fetch(`https://cne-functions.azurewebsites.net/api${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers,
        },
    });
};

// AUTH SERVICES
export const authService = {
    // Get current user info
    getCurrentUser: async (userId: string): Promise<User> => {
        try {
            const response = await apiCall(`/user/${userId}`);

            if (!response.ok) {
                throw new Error('Failed to get current user');
            }

            return await response.json();
        } catch (error) {
            // Fallback: construct user from stored data
            if (typeof window !== 'undefined') {
                const userId = localStorage.getItem('userId');
                const userEmail = localStorage.getItem('userEmail');

                if (!userId || !userEmail) {
                    throw new Error('No user data available');
                }

                return {
                    id: parseInt(userId),
                    email: userEmail,
                    username: userEmail.split('@')[0], // Fallback username
                    points: 0,
                    password: '' // Don't store password
                };
            }
            throw new Error('No user data available');
        }
    },
};

// USER SERVICES
export const userService = {
    // Login user - Updated to use correct endpoint
    login: async (email: string, password: string): Promise<ApiResponse<{token: string; email: string; id: string}>> => {
        try {
            const response = await fetch(`${apiBaseUrl}/user/login`, {
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

            if (data.token && typeof window !== 'undefined') {
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

    // Register user - Updated to use correct endpoint
    register: async (username: string, email: string, password: string): Promise<ApiResponse<{token: string; email: string; id: string}>> => {
        try {
            const response = await fetch(`${apiBaseUrl}/user/register`, {
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

            if (data.token && typeof window !== 'undefined') {
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
            const response = await apiCall('/users');

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
            const response = await apiCall('/communities');

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
            const response = await apiCall(`/communities/${id}`);

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

    // Get community by post ID - New endpoint
    getCommunityByPostId: async (postId: number): Promise<ApiResponse<Community>> => {
        try {
            const response = await apiCall(`/community/post/${postId}`);

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
            const response = await apiCall('/communities', {
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

    // Get user's joined communities - Updated endpoint
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

    // Join community - Updated endpoint
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

    // Leave community - Updated endpoint
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

    // Get posts by community - Updated endpoint
    getPostsByCommunity: async (communityId: string): Promise<ApiResponse<Post[]>> => {
        try {
            const response = await apiCall(`/post/community/${communityId}`);

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
                // Handle backend's inconsistent error format
                const errorMessage = errorData.message || errorData.error || 'Failed to create post';
                throw new Error(errorMessage);
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
    // Get all comments (by user) - Updated based on endpoint description
    getAllComments: async (): Promise<ApiResponse<Comment[]>> => {
        try {
            const response = await apiCall('/comments');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch comments');
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

    // Get comments by post
    getCommentsByPost: async (postId: number): Promise<ApiResponse<Comment[]>> => {
        try {
            const response = await apiCall(`/comments/post/${postId}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch comments');
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

    // Get comment by ID
    getCommentById: async (id: number): Promise<ApiResponse<Comment>> => {
        try {
            const response = await apiCall(`/comments/${id}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Comment not found');
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Comment not found'
            };
        }
    },

    // Create comment
    createComment: async (commentData: CommentInput): Promise<ApiResponse<Comment>> => {
        try {
            console.log('Creating comment with data:', commentData);

            const response = await apiCall('/comments', {
                method: 'POST',
                body: JSON.stringify({
                    text: commentData.text,
                    postId: commentData.postId,
                    userId: commentData.userId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Comment creation failed:', response.status, errorData);
                throw new Error(errorData.message || 'Failed to create comment');
            }

            const data = await response.json();
            console.log('Comment created successfully:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error creating comment:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create comment'
            };
        }
    },

    // Create reply (assuming this uses the same endpoint with parentId)
    createReply: async (replyData: ReplyInput): Promise<ApiResponse<Comment>> => {
        try {
            console.log('Creating reply with data:', replyData);

            const response = await apiCall('/comments', {
                method: 'POST',
                body: JSON.stringify({
                    text: replyData.text,
                    postId: replyData.postId,
                    userId: replyData.userId,
                    parentId: replyData.parentId
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Reply creation failed:', response.status, errorData);
                throw new Error(errorData.message || 'Failed to create reply');
            }

            const data = await response.json();
            console.log('Reply created successfully:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error creating reply:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to create reply'
            };
        }
    },

    // Legacy method for backward compatibility
    createCommentLegacy: async (text: string, postId: number): Promise<ApiResponse<Comment>> => {
        const userId = getCurrentUserId();
        if (!userId) {
            return {
                success: false,
                error: 'User not authenticated'
            };
        }

        return commentService.createComment({
            text,
            postId,
            userId
        });
    },

    // Legacy method for backward compatibility
    createReplyLegacy: async (text: string, postId: number, parentId: number): Promise<ApiResponse<Comment>> => {
        const userId = getCurrentUserId();
        if (!userId) {
            return {
                success: false,
                error: 'User not authenticated'
            };
        }

        return commentService.createReply({
            text,
            postId,
            userId,
            parentId
        });
    },

    // Get user's comments - Note: Based on the endpoint list, this appears to be what /comments returns
    getUserComments: async (userId: number): Promise<ApiResponse<Comment[]>> => {
        try {
            // The /comments endpoint appears to return comments by user based on the name "GetAllCommentsByUser"
            const response = await apiCall(`/comments`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch user comments');
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