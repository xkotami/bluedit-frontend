const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const getAllComments = async () => {
    return fetch(`${BASE_URL}/comment/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getCommentById = async (id: number) => {
    return fetch(`${BASE_URL}/comment/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const getCommentByUserId = async (id: number) => {
    return fetch(`${BASE_URL}/comment/user/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const createComment = async (input: { text: string; postId: number; userId: string }, token: string) => {
    return fetch(`${BASE_URL}/comment/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({input: input})
    });
};

const createReply = async (input: { text: string, postId: number, parentId: number }, token: string) => {
    return fetch(`${BASE_URL}/comment/reply`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ input: input })
    });
};

export default {
    getAllComments,
    getCommentById,
    getCommentByUserId,
    createComment,
    createReply,
}