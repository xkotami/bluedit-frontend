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

export default {
    getAllComments,
    getCommentById,
    getCommentByUserId,
}