const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const getAllPosts = async () => {
    return fetch(`${BASE_URL}/post/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getPostById = async (id: number) => {
    return fetch(`${BASE_URL}/post/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getAllPostsOfCommunity = async (communityId: number) => {
    return fetch(`${BASE_URL}/post/community/${communityId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const createPost = async (input: { title: string, content: string, userId: string, communityId: number }, token: string) => {
    return fetch(`${BASE_URL}/post`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ input: input })
    });
};

export default {
    getAllPosts,
    getPostById,
    getAllPostsOfCommunity,
    createPost,
}